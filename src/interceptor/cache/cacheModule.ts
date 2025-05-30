import { CacheInterceptor } from '@nestjs/cache-manager';
import { Module} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store'; // 安装依赖：npm install cache-manager-redis-store

@Module({
  imports: [
    // 注册缓存模块，使用 Redis 存储
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Redis 服务器地址，根据实际情况修改
      port: 6379,        // Redis 端口
      ttl: 5,            // 默认缓存时间（单位秒）
    }),
  ],
  providers: [
    // 全局缓存拦截器
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheModule],
})
export class CacheModule {}
