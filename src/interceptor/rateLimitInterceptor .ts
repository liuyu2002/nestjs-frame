import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express'; // 导入 Express 的类型
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
    private readonly logger = new Logger(RateLimitInterceptor.name); // 使用 Logger

    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        // 应用限流逻辑
        this.applyRateLimit(context, request, response);

        // 返回 Observable，并在管道中打印响应数据
        return next.handle().pipe(
            tap({
                next: (responseBody) => {
                    // 打印响应数据
                    this.logger.debug(`响应数据: ${JSON.stringify(responseBody)}`);
                },
            }),
        );
    }

    /**
     * 应用限流逻辑
     */
    private applyRateLimit(context: ExecutionContext, request: Request, response: Response) {
        const rateLimitConfig = this.reflector.get<{ limit: number; ttl: number }>(
            'RATE_LIMIT_KEY',
            context.getHandler(),
        );

        if (rateLimitConfig) {
            const { limit, ttl } = rateLimitConfig;

            const limiter = rateLimit({
                windowMs: ttl * 1000, // 时间窗口（毫秒）
                max: limit, // 每个时间窗口内的最大请求数
                handler: () => {
                    throw new HttpException(
                        '请求过于频繁，请稍后再试',
                        HttpStatus.TOO_MANY_REQUESTS,
                    );
                },
            });

            // 调用限流中间件，强制转换 request 和 response 类型
            limiter(request as Request, response as Response, (err) => {
                if (err) {
                    throw new HttpException(
                        '请求过于频繁，请稍后再试',
                        HttpStatus.TOO_MANY_REQUESTS,
                    );
                }
            });
        }
    }
}