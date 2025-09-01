import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import { setupSwagger } from './configs/swagger.config';
import { CDebug, CPort } from './configs/CConfig';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap', { timestamp: true });

  // 全局前缀
  app.setGlobalPrefix('api');

  // 启用 CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 启用压缩
  app.use(compression());

  // 启用安全头
  app.use(helmet());

  // 全局验证管道由 APP_PIPE 提供，避免与此处重复注册

  // 请求体大小限制
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  if (CDebug) {
    setupSwagger(app);
    logger.debug(`Swagger documentation available at http://localhost:${CPort}/docs`);
  }

  await app.listen(CPort);
  logger.log(`Application is running on: http://localhost:${CPort}`);
}

bootstrap();
