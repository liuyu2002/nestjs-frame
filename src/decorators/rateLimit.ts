import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit'; // 元数据键
export const RateLimit = (limit: number, ttl: number) =>   //@RateLimit(10, 60) // 每分钟最多 10 次请求
    SetMetadata(RATE_LIMIT_KEY, { limit, ttl });