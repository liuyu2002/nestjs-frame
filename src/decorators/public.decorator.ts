import { SetMetadata } from '@nestjs/common';

/**
 * Public 装饰器：标记路由可跳过认证
 * 与现有 `SkipAuth` 等价，统一元数据键值
 */
export const IS_PUBLIC_KEY = 'skipAuth';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

