import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceService } from './performance.service';
import { RequestMetric } from '../entities/requestMetric';
import { PerformanceInterceptor } from '../interceptor/performanceInterceptor';

@Module({
    imports: [TypeOrmModule.forFeature([RequestMetric])],
    providers: [PerformanceService, PerformanceInterceptor],
    exports: [PerformanceService, PerformanceInterceptor],
})
export class MonitorModule {} 