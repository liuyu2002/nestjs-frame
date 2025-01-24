import { CacheInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CMysql } from './configs/CMysql';
import { CTimescaleDB } from './configs/CTimescaleDB';
import { SensorData } from './entities/TSDB/sensor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorLogService } from './httpException/errorLogService';
import { AllExceptionsFilter } from './httpException/allExceptionsFilter';
import { RequestMetric } from './entities/requestMetric';
import { ErrorLog } from './entities/errorLog';
import { ModulesAdmin } from './modules/admin/modules';
import { RateLimitInterceptor } from './interceptor/rateLimitInterceptor ';
import { LoggingAspect } from './logger/loggingAspect';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   ...CTimescaleDB,
    //   entities: [SensorData]
    // }),
    TypeOrmModule.forRoot(CMysql),
    TypeOrmModule.forFeature([SensorData,RequestMetric,ErrorLog]),
    ...ModulesAdmin,
  ],
  controllers: [],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: LoggingAspect,
},{
    provide: APP_INTERCEPTOR,
    useClass: RateLimitInterceptor,
},ErrorLogService, // 注册 ErrorLogService
{
    provide: APP_FILTER, // 全局注册异常处理器
    useClass: AllExceptionsFilter,
},],
})
export class AppModule {}
