// src/cache/cache.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * 自定义缓存装饰器
 * @param ttl 过期时间（秒）
 */
export const UseCache = (ttl: number = 300) => SetMetadata('cacheTTL', ttl);
