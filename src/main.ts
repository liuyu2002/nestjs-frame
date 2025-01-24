import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { log } from 'console';
import { CDebug, CPort } from './configs/CConfig';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const log = new Logger('bootstrap', { timestamp: true });
  if (CDebug) {
    const Swagger = new DocumentBuilder()
      .setTitle('')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, Swagger);
    const api = 'api';
    SwaggerModule.setup(api, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    log.debug(`丝袜哥: http://localhost:${CPort}/${api}/`);
  }
  await app.listen(CPort);
}
bootstrap();
