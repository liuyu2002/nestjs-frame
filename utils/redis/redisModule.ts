import { Module } from '@nestjs/common';
import { RedisService } from './redisService';

@Module({
    providers: [RedisService],
    exports: [RedisService], // 导出 RedisService
})
export class RedisModule { }
