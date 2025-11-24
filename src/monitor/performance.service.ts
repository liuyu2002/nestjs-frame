import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestMetric } from '../entities/requestMetric';
import { performance } from 'perf_hooks';

@Injectable()
export class PerformanceService {
    private readonly logger = new Logger(PerformanceService.name);

    constructor(
        @InjectRepository(RequestMetric)
        private requestMetricRepository: Repository<RequestMetric>,
    ) {}

    async recordRequestMetric(
        path: string,
        method: string,
        startTime: number,
        endTime: number,
        statusCode: number,
        error?: string,
        requestParams?: string,
        responseParams?: string,
        ip?: string,
        userId?: number,
    ) {
        const duration = endTime - startTime;
        const metric = this.requestMetricRepository.create({
            path,
            method,
            duration,
            statusCode,
            error,
            timestamp: new Date(),
            requestParams,
            responseParams,
            ip,
            userId,
        });

        try {
            //如果返回值的长度小于200，保存
            if(responseParams && responseParams.length < 200){
                metric.responseParams = responseParams;
            }else{
                metric.responseParams = '响应参数过长，不予保存,请于文件日志中查看';
            }
            
            await this.requestMetricRepository.save(metric);
        } catch (error) {
            this.logger.error(`Failed to save request metric: ${error.message}`);
        }
    }

    async getPerformanceMetrics(
        startDate: Date,
        endDate: Date,
    ): Promise<{
        avgResponseTime: number;
        totalRequests: number;
        errorRate: number;
        requestsByPath: any[];
    }> {
        const metrics = await this.requestMetricRepository
            .createQueryBuilder('metric')
            .where('metric.timestamp BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            })
            .getMany();

        const totalRequests = metrics.length;
        const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
        const errorCount = metrics.filter(m => m.statusCode >= 400).length;

        const requestsByPath = metrics.reduce((acc, metric) => {
            const path = metric.path;
            if (!acc[path]) {
                acc[path] = {
                    path,
                    count: 0,
                    avgDuration: 0,
                    totalDuration: 0,
                };
            }
            acc[path].count++;
            acc[path].totalDuration += metric.duration;
            acc[path].avgDuration = acc[path].totalDuration / acc[path].count;
            return acc;
        }, {});

        return {
            avgResponseTime: totalRequests ? totalDuration / totalRequests : 0,
            totalRequests,
            errorRate: totalRequests ? (errorCount / totalRequests) * 100 : 0,
            requestsByPath: Object.values(requestsByPath),
        };
    }

    async getMemoryUsage() {
        const memoryUsage = process.memoryUsage();
        return {
            rss: this.formatBytes(memoryUsage.rss),
            heapTotal: this.formatBytes(memoryUsage.heapTotal),
            heapUsed: this.formatBytes(memoryUsage.heapUsed),
            external: this.formatBytes(memoryUsage.external),
        };
    }

    private formatBytes(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
} 