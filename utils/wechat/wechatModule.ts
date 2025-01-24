import { Module } from '@nestjs/common';
import { WechatUtilService } from './wechat';
import { RedisModule } from '../redis/redisModule';

@Module({
    imports: [RedisModule],
    providers: [WechatUtilService],
    exports: [WechatUtilService],
})
export class WechatModule { }
