import {
  BadRequestException,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';
import { OrdersService } from './orders.service';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payment-proofs');
  },
  filename: (req, file, cb) => {
    const randomName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'Invalid file type. Allowed types: JPEG, PNG, WebP, PDF',
      ),
      false,
    );
  }
};

@Controller('orders')
export class PaymentProofController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('upload-payment-proof/:orderId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: {
        fileSize: 4 * 1024 * 1024,
      },
    }),
  )
  async uploadPaymentProof(
    @Param('orderId', ParseIntPipe) orderId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      await this.ordersService.savePaymentProof(orderId, file.filename);

      return {
        success: true,
        message: 'Payment proof uploaded successfully',
        orderId,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        uploadedAt: new Date(),
      };
    } catch (error: any) {
      throw new BadRequestException(
        error.message || 'Failed to save payment proof',
      );
    }
  }
}
