import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CDebug, CPort } from './configs/CConfig';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import * as helmet from 'helmet';
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

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 请求体大小限制
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  if (CDebug) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API documentation for the application')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
    });
    logger.debug(`Swagger documentation available at http://localhost:${CPort}/docs`);
  }

  await app.listen(CPort);
  logger.log(`Application is running on: http://localhost:${CPort}`);
}

bootstrap();
