import { CacheInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CMysql } from './configs/CMysql';
import { CTimescaleDB } from './configs/CTimescaleDB';
import { SensorData } from './entities/TSDB/sensor';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ErrorLogService } from './httpException/errorLogService';
import { AllExceptionsFilter } from './httpException/allExceptionsFilter';
import { RequestMetric } from './entities/requestMetric';
import { ErrorLog } from './entities/errorLog';
import { ModulesAdmin } from './modules/admin/modules';
import { LoggingInterceptor } from './interceptor/loggingInterceptor';
import { ModulesMiddleware } from './middleware/module';
import { RateLimitInterceptor } from './interceptor/rateLimitInterceptor';
import { WebSocketModule } from './websocket/module';
import { MqttModule } from './mqtt/module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './interceptor/transformInterceptor';
import { MonitorModule } from './monitor/monitor.module';
import { PerformanceInterceptor } from './interceptor/performanceInterceptor';
import { getRedisConfig } from './configs/redis.config';
import { GlobalJwtModule } from './common/global/jwt.module';
import { GuardModule } from './guard/module';
import { EntitiesModule } from './entities/entities.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getRedisConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(CMysql),
    ...ModulesAdmin,
    ModulesMiddleware,
    WebSocketModule,
    MqttModule,
    MonitorModule,
    GlobalJwtModule,
    GuardModule,
    EntitiesModule,
    HealthModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    ErrorLogService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
