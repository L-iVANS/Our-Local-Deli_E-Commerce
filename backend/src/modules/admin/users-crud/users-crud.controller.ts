import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersCrudService } from './users-crud.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtAuthGuard } from '../../general/auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../general/auth/guards/roles.guard';

@Controller()
export class UsersCrudController {
  constructor(private readonly usersCrudService: UsersCrudService) {}

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    const users = await this.usersCrudService.allUsers();
    return users.map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.middleName} ${user.lastName}`,
    }));
  }

  @Post('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createUser(@Body() input: CreateUserDto) {
    return await this.usersCrudService.createUser(input);
  }

  @Patch('users/:userId')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() input: UpdateUserDto,
    @Req() req: Request,
  ) {
    const authUser = (req as any).user;
    const requesterId = authUser?.userId;
    const userRole = authUser?.role;

    if (!requesterId) throw new ForbiddenException('Not authenticated');

    if (userId !== requesterId && userRole !== 'admin') {
      throw new ForbiddenException('You can only update your own profile');
    }

    return await this.usersCrudService.updateUser({
      ...input,
      userId,
    });
  }

  @Delete('admin/users/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersCrudService.deleteUser(userId);
  }

  @Get('users/profile')
  @UseGuards(JwtAuthGuard)
  async readProfile(@Req() req: Request) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    if (!userId) throw new ForbiddenException('Not authenticated');
    const user = await this.usersCrudService.readProfile(userId);
    if (!user) return user;
    return {
      ...user,
      fullName: `${user.firstName} ${user.middleName} ${user.lastName}`,
    };
  }
}
