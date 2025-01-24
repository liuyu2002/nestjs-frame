import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as Redis from 'ioredis';
import { CRedisBase } from 'src/configs/CRedis';
import * as cron from 'node-cron';
const moment = require('moment');
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis.Redis;
    private readonly key = 'sequence';
    constructor() {
        console.log('RedisService instance created');
    }
    onModuleInit() {
        this.client = new Redis.default(CRedisBase);

        this.client.on('error', (err) => {
            console.error('Redis error:', err);
        });

        console.log('Connected to Redis');

        // 设置定时任务，每天0点重置计数器
        cron.schedule('0 0 * * *', async () => {
            await this.resetCounter();
        });
    }

    onModuleDestroy() {
        this.client.quit();
    }

    getClient(): Redis.Redis {
        return this.client;
    }

    // 获取递增的序列值
    async getNextSequence(): Promise<string> {
        const sequence = await this.client.incr(this.key);
        // 确保返回4位数字，不足前面补零
        return sequence.toString().padStart(4, '0');
    }

    // 重置计数器
    async resetCounter(): Promise<void> {
        await this.client.set(this.key, '0');
    }

    //获取订单号方法
    async getOrderNo() {
        const sequence = await this.client.incr(this.key);
        return moment().format('YYYYMMDD') + sequence.toString().padStart(4, '0');
    }

}
