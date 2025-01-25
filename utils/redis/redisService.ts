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
        this.client.on('error', (err) => console.error('Redis error:', err));
        console.log('Connected to Redis');
        
        // 每天0点重置计数器
        cron.schedule('0 0 * * *', async () => await this.resetCounter());
    }

    onModuleDestroy() {
        this.client.quit();
    }

    // ---------- 基础操作 ----------
    /** 检查键是否存在 */
    async exists(key: string): Promise<number> {
        return this.client.exists(key);
    }

    /** 设置键过期时间（秒） */
    async expire(key: string, seconds: number): Promise<number> {
        return this.client.expire(key, seconds);
    }

    /** 删除键 */
    async del(key: string): Promise<number> {
        return this.client.del(key);
    }

    // ---------- 字符串操作 ----------
    /** 设置字符串值、设置过期时间 */
    async set(key: string, value: string, ttl?: number): Promise<'OK'> {
        if (ttl) {
            return this.client.setex(key, ttl, value);
        }
        return this.client.set(key, value);
    }

    /** 获取字符串值 */
    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    /** 自增数值 */
    async incr(key: string): Promise<number> {
        return this.client.incr(key);
    }

    // ---------- 哈希操作 ----------
    /** 设置哈希字段值 */
    async hset(key: string, field: string, value: string): Promise<number> {
        return this.client.hset(key, field, value);
    }

    /** 获取哈希字段值 */
    async hget(key: string, field: string): Promise<string | null> {
        return this.client.hget(key, field);
    }

    /** 获取所有哈希字段 */
    async hgetall(key: string): Promise<Record<string, string>> {
        return this.client.hgetall(key);
    }

    // ---------- 列表操作 ----------
    /** 从左侧推入列表 */
    async lpush(key: string, ...values: string[]): Promise<number> {
        return this.client.lpush(key, ...values);
    }

    /** 获取列表范围 */
    async lrange(key: string, start: number, stop: number): Promise<string[]> {
        return this.client.lrange(key, start, stop);
    }

    // ---------- 集合操作 ----------
    /** 添加集合元素 */
    async sadd(key: string, ...members: string[]): Promise<number> {
        return this.client.sadd(key, ...members);
    }

    /** 获取集合所有成员 */
    async smembers(key: string): Promise<string[]> {
        return this.client.smembers(key);
    }

    // ---------- 有序集合操作 ----------
    /** 添加有序集合成员 */
    async zadd(key: string, score: number, member: string): Promise<number> {
        return this.client.zadd(key, score.toString(), member);
    }

    /** 按分数范围获取成员 */
    async zrangebyscore(key: string, min: number, max: number): Promise<string[]> {
        return this.client.zrangebyscore(key, min, max);
    }

    // ---------- 发布订阅 ----------
    /** 发布消息到频道 */
    async publish(channel: string, message: string): Promise<number> {
        return this.client.publish(channel, message);
    }

    // ---------- 事务操作 ----------
    /** 开启事务 */
    async multi(): Promise<Redis.ChainableCommander> {
        return this.client.multi();
    }

    // ---------- 分布式锁 ----------
    /** 尝试获取分布式锁 */
    async acquireLock(
        lockKey: string,
        value: string,
        expireTime: number
    ): Promise<boolean> {
        const result = await this.client.set(
            lockKey,
            value,
            'PX',
            expireTime,
            'NX'
        );
        return result === 'OK';
    }

    /** 释放分布式锁（需验证值） */
    async releaseLock(lockKey: string, value: string): Promise<void> {
        const script = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;
        await this.client.eval(script, 1, lockKey, value);
    }

    // ---------- 原代码保留方法 ----------
    getClient(): Redis.Redis {
        return this.client;
    }

    async getNextSequence(): Promise<string> {
        const sequence = await this.client.incr(this.key);
        return sequence.toString().padStart(4, '0');
    }

    async resetCounter(): Promise<void> {
        await this.client.set(this.key, '0');
    }

    async getOrderNo(): Promise<string> {
        const sequence = await this.client.incr(this.key);
        return moment().format('YYYYMMDD') + sequence.toString().padStart(4, '0');
    }

    // ---------- 其他实用方法 ----------
    /** 批量查询键 */
    async keys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern);
    }

    /** 清空当前数据库 */
    async flushdb(): Promise<'OK'> {
        return this.client.flushdb();
    }

    /** 测试连接 */
    async ping(): Promise<string> {
        return this.client.ping();
    }
}