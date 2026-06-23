import {
  BadRequestException,
  Controller,
  OnModuleInit,
  Post,
  UnauthorizedException,
  UseGuards,
  Body,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './responses/login.response';
import { RateLimitService } from './services/rate-limit.service';
import { BruteForceService } from './services/brute-force.service';
import { getClientIp } from './services/get-client-ip';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

function secondsToReadable(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly rateLimitService: RateLimitService,
    private readonly bruteForceService: BruteForceService,
  ) {}

  onModuleInit() {
    setInterval(() => {
      this.rateLimitService.cleanup();
      this.bruteForceService.cleanup();
    }, 5 * 60 * 1000);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const user = (req as any).user;
    return {
      userId: user.userId,
      fullName: user.fullName,
      emailAddress: user.emailAddress,
      role: user.role,
    };
  }

  @Post('login')
  async login(
    @Body() input: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const clientIp = getClientIp(req);

    const ipRateLimit = this.rateLimitService.check(
      `login:ip:${clientIp}`,
      20,
      15 * 60 * 1000,
    );
    if (!ipRateLimit.allowed) {
      const readableTime = secondsToReadable(ipRateLimit.retryAfter ?? 0);
      throw new BadRequestException(
        `Too many login attempts from your IP. Please try again in ${readableTime}.`,
      );
    }

    const emailRateLimit = this.rateLimitService.check(
      `login:email:${input.emailAddress}`,
      5,
      15 * 60 * 1000,
    );
    if (!emailRateLimit.allowed) {
      const readableTime = secondsToReadable(emailRateLimit.retryAfter ?? 0);
      throw new BadRequestException(
        `Too many login attempts for this email. Please try again in ${readableTime}.`,
      );
    }

    const brfKey = `login:brute:${input.emailAddress}`;
    const isLocked = this.bruteForceService.isLocked(brfKey);
    if (isLocked.locked) {
      const readableTime = secondsToReadable(
        Math.ceil((isLocked.remainingMs ?? 0) / 1000),
      );
      throw new BadRequestException(
        `This account is temporarily locked due to too many failed attempts. Please try again in ${readableTime}.`,
      );
    }

    const users = await this.authService.validateUser(
      input.emailAddress,
      input.password,
    );

    if (!users) {
      const failure = this.bruteForceService.recordFailure(brfKey);
      if (failure.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, failure.delay));
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    this.bruteForceService.clearFailures(brfKey);
    this.rateLimitService.reset(`login:ip:${clientIp}`);
    this.rateLimitService.reset(`login:email:${input.emailAddress}`);

    const accessToken = await this.authService.login(users);
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    const cookieDomain = this.configService.get<string>('AUTH_COOKIE_DOMAIN');

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: isProduction ? '.synchores.com' : undefined,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    res.setHeader('Cache-Control', 'no-store');

    return { message: 'Login successful' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response): LoginResponse {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    const cookieDomain = this.configService.get<string>('AUTH_COOKIE_DOMAIN');

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      domain: isProduction ? '.synchores.com' : undefined,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    res.setHeader('Cache-Control', 'no-store');

    return { message: 'Logout successful' };
  }
}
