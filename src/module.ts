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
import { LoggingInterceptor } from './interceptor/rateLimitInterceptor ';
import { ModulesMiddleware } from './middleware/module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   ...CTimescaleDB,
    //   entities: [SensorData]
    // }),
    TypeOrmModule.forRoot(CMysql),
    TypeOrmModule.forFeature([SensorData,RequestMetric,ErrorLog]),
    ...ModulesAdmin,
    ModulesMiddleware
  ],
  controllers: [],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
},ErrorLogService, // 注册 ErrorLogService
{
    provide: APP_FILTER, // 全局注册异常处理器
    useClass: AllExceptionsFilter,
},],
})
export class AppModule {}
