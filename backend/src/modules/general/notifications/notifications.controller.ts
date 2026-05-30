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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNotificationsByUserId(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ForbiddenException(
        'Unauthorized: User ID not found in request',
      );
    }
    return await this.notificationsService.getNotificationsByUserId(userId);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  async getUnreadNotificationCount(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ForbiddenException(
        'Unauthorized: User ID not found in request',
      );
    }
    return await this.notificationsService.getUnreadCount(userId);
  }

  @Get(':notificationId')
  @UseGuards(JwtAuthGuard)
  async getNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ForbiddenException(
        'Unauthorized: User ID not found in request',
      );
    }
    const notification =
      await this.notificationsService.getNotificationById(notificationId);
    if (notification.userId !== userId) {
      throw new ForbiddenException(
        'Unauthorized: Cannot access this notification',
      );
    }
    return notification;
  }

  @Post('/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createNotification(@Body() input: CreateNotificationDto) {
    return await this.notificationsService.createNotification(input);
  }

  @Patch(':notificationId/read')
  @UseGuards(JwtAuthGuard)
  async markNotificationAsRead(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ForbiddenException(
        'Unauthorized: User ID not found in request',
      );
    }
    const notification =
      await this.notificationsService.getNotificationById(notificationId);
    if (notification.userId !== userId) {
      throw new ForbiddenException(
        'Unauthorized: Cannot modify this notification',
      );
    }
    return await this.notificationsService.markAsRead(notificationId);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  async markAllNotificationsAsRead(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ForbiddenException(
        'Unauthorized: User ID not found in request',
      );
    }
    return await this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':notificationId')
  @UseGuards(JwtAuthGuard)
  async deleteNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new ForbiddenException(
        'Unauthorized: User ID not found in request',
      );
    }
    const notification =
      await this.notificationsService.getNotificationById(notificationId);
    if (notification.userId !== userId) {
      throw new ForbiddenException(
        'Unauthorized: Cannot delete this notification',
      );
    }
    await this.notificationsService.deleteNotification(notificationId);
    return { success: true };
  }
}
