import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Observable } from 'rxjs';
import { RedisService } from 'utils/redis/redisService';
  
  // 内存中的限流存储
  const rateLimitStorage = new Map<string, { count: number; expiresAt: number }>();
  
  @Injectable()
  export class RateLimitInterceptor implements NestInterceptor {
    constructor(
      private readonly reflector: Reflector,
      private readonly redisService: RedisService,
    ) {setInterval(() => {
        const now = Date.now();
        for (const [key, value] of rateLimitStorage.entries()) {
          if (value.expiresAt <= now) {
            rateLimitStorage.delete(key);
          }
        }
      }, 60 * 1000); // 每分钟清理一次
      }
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const rateLimit = this.reflector.get<{ limit: number; ttl: number }>(
        'RATE_LIMIT_KEY',
        context.getHandler(),
      );
      const userId = context.switchToHttp().getRequest().userInfo.id;
      console.log('userId', context.switchToHttp().getRequest().userInfo);
      if(userId){
        //更新redis中的活动时间
        await this.redisService.set(`ws:activity:${userId}`, Date.now().toString());
      }
      if (!rateLimit) {
        // 如果没有设置限流装饰器，直接放行
        return next.handle();
      }

      
  
      const { limit, ttl } = rateLimit;
      const req = context.switchToHttp().getRequest();
      const ip = req.ip; // 根据 IP 限流
      const route = req.originalUrl; // 根据路由限流
      const key = `${route}:${ip}`;
  
      const now = Date.now();
      const record = rateLimitStorage.get(key);
  
      if (record) {
        if (record.expiresAt > now) {
          if (record.count >= limit) {
            throw new HttpException('请求过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS);
          }
          record.count += 1;
        } else {
          // 重置计数器
          rateLimitStorage.set(key, { count: 1, expiresAt: now + ttl * 1000 });
        }
      } else {
        // 初始化计数器
        rateLimitStorage.set(key, { count: 1, expiresAt: now + ttl * 1000 });
      }
  
      return next.handle();
    }
  }
  