// src/cache/cache.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'utils/redis/redisService';
import * as crypto from 'crypto';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    private readonly CACHE_VERSION = 'v1'; // 缓存版本控制

    constructor(
        private reflector: Reflector,
        private redisService: RedisService
    ) {}

    private generateCacheKey(request: any): string {
        const url = request.originalUrl;
        const query = request.query;
        const body = request.body;
        
        // 使用 MD5 生成更短的 key
        const content = JSON.stringify({ url, query, body });
        const hash = crypto.createHash('md5').update(content).digest('hex');
        
        return `cache:${this.CACHE_VERSION}:${hash}`;
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();

        // 获取缓存TTL（默认300秒）
        const ttl = this.reflector.get<number>('cacheTTL', handler) || 300;

        // 获取是否使用缓存的元数据
        const useCache = this.reflector.get<boolean>('useCache', handler);
        if (!useCache) return next.handle();

        // 生成缓存 key
        const key = this.generateCacheKey(request);

        // 检查 Redis 缓存
        const cachedData = await this.redisService.get(key);
        if (cachedData) {
            return of(JSON.parse(cachedData));
        }

        return next.handle().pipe(
            tap(async (response) => {
                // 只缓存成功的响应
                if (response && response.status !== 'error') {
                    await this.redisService.set(key, JSON.stringify(response), ttl);
                }
            }),
        );
    }
}
