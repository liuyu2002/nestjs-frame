import { CacheInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CMysql } from './configs/CMysql';
import { CTimescaleDB } from './configs/CTimescaleDB';
import { SensorData } from './entities/TSDB/sensor';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   ...CTimescaleDB,
    //   entities: [SensorData]
    // }),
    TypeOrmModule.forRoot(CMysql),
    TypeOrmModule.forFeature([SensorData,RequestMetric,ErrorLog]),
    ...ModulesAdmin,
    ModulesMiddleware,
    WebSocketModule,
    MqttModule
  ],
  controllers: [],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
},ErrorLogService, // 注册 ErrorLogService
{
    provide: APP_FILTER, // 全局注册异常处理器
    useClass: AllExceptionsFilter,
},{
  provide: APP_INTERCEPTOR,
  useClass: RateLimitInterceptor,
},],
})
export class AppModule {}
