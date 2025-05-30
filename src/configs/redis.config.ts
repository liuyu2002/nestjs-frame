import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisClientOptions } from 'redis';

export const getRedisConfig = (configService: ConfigService): CacheModuleOptions => {
    const redisConfig: RedisClientOptions = {
        socket: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6379),
        },
    };

    return {
        isGlobal: true,
        ttl: configService.get('REDIS_TTL', 300),
        ...redisConfig,
    };
}; 