import { Global, Module } from '@nestjs/common';
import { RedisService } from './redisService';
@Global()
@Module({
    providers: [RedisService],
    exports: [RedisService], // 导出 RedisService
})
export class RedisModule { }
