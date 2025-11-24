import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PerformanceService } from '../monitor/performance.service';
import { performance } from 'perf_hooks';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
    constructor(private performanceService: PerformanceService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const startTime = performance.now();
        const userInfo = request.userInfo;
        return next.handle().pipe(
            tap({
                next: (data) => {
                    const endTime = performance.now();
                    this.performanceService.recordRequestMetric(
                        request.path,
                        request.method,
                        startTime,
                        endTime,
                        200,
                        undefined,
                        JSON.stringify(request.body),
                        JSON.stringify(data),
                        request.ip,
                        userInfo?.id,
                    );
                },
                error: (error) => {
                    const endTime = performance.now();
                    this.performanceService.recordRequestMetric(
                        request.path,
                        request.method,
                        startTime,
                        endTime,
                        error.status || 500,
                        error.message,
                        JSON.stringify(request.body),
                        undefined,
                        request.ip,
                        userInfo?.id,
                    );
                },
            }),
        );
    }
} 