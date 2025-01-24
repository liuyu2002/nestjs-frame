import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { Reflector } from '@nestjs/core';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    constructor(private readonly reflector: Reflector) {}

    use(req: Request, res: Response, next: NextFunction) {
        const routeHandler = req.route?.stack?.[0]?.handle;
        if (!routeHandler) {
            return next();
        }
        // 获取控制器类
        const controllerClass = routeHandler.constructor;
        // 获取方法名
        const methodName = routeHandler.name;
        // 从控制器类和方法中获取元数据
        const rateLimitConfig = this.reflector.get<{ limit: number; ttl: number }>(
            'RATE_LIMIT_KEY',
            controllerClass.prototype[methodName],
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
            // 调用限流中间件
            limiter(req, res, next);
        } else {
            next();
        }
    }
}