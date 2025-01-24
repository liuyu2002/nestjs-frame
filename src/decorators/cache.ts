import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'cache'; // 元数据键
export const Cache = (ttl: number) => SetMetadata(CACHE_KEY, ttl);   //@Cache(60) 缓存60秒