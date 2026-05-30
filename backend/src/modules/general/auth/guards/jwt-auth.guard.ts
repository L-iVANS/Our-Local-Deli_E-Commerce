import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);

    if (!request) {
      throw new UnauthorizedException('Invalid request context');
    }

    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getRequest(context: ExecutionContext): any {
    const httpRequest = context.switchToHttp().getRequest();
    if (httpRequest) {
      return httpRequest;
    }

    const gqlContext = context.getArgByIndex(2);
    return gqlContext?.req ?? null;
  }

  private extractTokenFromRequest(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    if (request.cookies?.access_token) {
      return request.cookies.access_token;
    }

    return null;
  }
}
