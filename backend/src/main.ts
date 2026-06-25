import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ cookieParser FIRST — must parse cookies before guards run
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // ✅ changed — don't reject unknown fields
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // ✅ auto converts "1" → 1 for @IsInt()
      },
    }),
  );

  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = (
    process.env.FRONTEND_ORIGINS ??
    process.env.FRONTEND_ORIGIN ??
    'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ helmet AFTER cors
  app.use(
    helmet({
      contentSecurityPolicy: isProduction,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // ✅ Remove the manual Access-Control headers — enableCors() handles this
  // Having both causes duplicate header conflicts
  // ❌ REMOVED this block:
  // app.use((req, res, next) => {
  //   const origin = req.get('origin');
  //   if (!origin || allowedOrigins.includes(origin)) {
  //     res.setHeader('Access-Control-Allow-Origin', origin || '*');
  //     res.setHeader('Access-Control-Allow-Credentials', 'true');
  //   }
  //   next();
  // });

  await app.listen(process.env.PORT ?? 4000);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        console.log('VALIDATION ERRORS:', JSON.stringify(errors, null, 2));

        return new BadRequestException(errors);
      },
    }),
  );
}

bootstrap();
