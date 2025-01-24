import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { RequestMetric } from 'src/entities/requestMetric';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LoggingAspect implements NestInterceptor {
    private readonly logger = new Logger('LoggingAspect');

    constructor(
        @InjectRepository(RequestMetric)
        private readonly metricRepository: Repository<RequestMetric>,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const startTime = Date.now();

        // 记录请求日志
        this.logRequest(request);

        return next.handle().pipe(
            tap({
                next: async (responseBody) => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    const statusCode = response.statusCode;
                    // 记录响应日志
                    this.logResponse(request, statusCode, duration);

                    // 保存请求记录（非 GET 请求）
                    if (request.method !== 'GET') {
                        await this.saveRequestMetric({
                            method: request.method,
                            path: request.url,
                            statusCode,
                            duration,
                            userId: (request as any).userId,
                            userIp: this.getUserIp(request),
                            requestBody: this.safeStringify(request.body),
                            responseBody: this.safeStringify(responseBody),
                            created_at: new Date(),
                        });
                    }

                    // 慢请求警告
                    if (duration > 1000) {
                        this.logger.warn(
                            `慢请求: ${request.method} ${request.url} - ${duration / 1000}秒`,
                        );
                    }
                },
                error: async (error) => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;

                    // 记录错误日志
                    this.logError(request, error, duration);

                    // 保存错误请求记录
                    await this.saveRequestMetric({
                        method: request.method,
                        path: request.url,
                        statusCode: error.status || 500,
                        duration,
                        userId: (request as any).userId,
                        userIp: this.getUserIp(request),
                        requestBody: this.safeStringify(request.body),
                        error: this.safeStringify(error),
                        created_at: new Date(),
                    });
                },
            }),
        );
    }

    /**
     * 记录请求日志
     */
    private logRequest(request: Request) {
        this.logger.debug(
            `${request.method} ${request.url} - ${JSON.stringify(request.body)}`,
        );
    }

    /**
     * 记录响应日志
     */
    private logResponse(request: Request, statusCode: number, duration: number) {
        this.logger.debug(
            `${request.method} ${request.url} ${statusCode} - ${duration / 1000}秒`,
        );
    }

    /**
     * 记录错误日志
     */
    private logError(request: Request, error: any, duration: number) {
        this.logger.error(
            `请求接口错误: ${request.method} ${request.url} - ${duration}ms`,
            error.stack,
        );
    }

    /**
     * 获取用户 IP
     */
    private getUserIp(request: Request): string {
        const ip =
            (request.headers['x-forwarded-for'] as string) ||
            (request.headers['x-real-ip'] as string) ||
            request.socket.remoteAddress ||
            '';

        return ip.split(',')[0].trim();
    }

    /**
     * 安全地序列化对象
     */
    private safeStringify(obj: any): string {
        try {
            return obj ? JSON.stringify(obj) : '';
        } catch (error) {
            return '[Circular]';
        }
    }

    /**
     * 保存请求记录
     */
    private async saveRequestMetric(metric: Partial<RequestMetric>) {
        return await this.metricRepository.save(metric);
    }
}