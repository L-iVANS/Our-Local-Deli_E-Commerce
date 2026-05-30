import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const randomName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'Invalid file type. Allowed types: JPEG, PNG, WebP',
      ),
      false,
    );
  }
};

@Controller('admin/products')
export class ProductImageController {
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      const imageUrl = `/uploads/products/${file.filename}`;

      return {
        success: true,
        message: 'Product image uploaded successfully',
        imageUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        uploadedAt: new Date(),
      };
    } catch (error: any) {
      throw new BadRequestException(
        error.message || 'Failed to save product image',
      );
    }
  }
}
