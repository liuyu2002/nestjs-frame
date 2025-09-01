import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * 请求ID中间件：为每个进入的请求注入 `x-request-id`
 * - 便于日志链路追踪
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const headerKey = 'x-request-id';
    const existingId = req.headers[headerKey] as string | undefined;
    const requestId = existingId && existingId.length > 0 ? existingId : uuidv4();

    // 将 requestId 设置到请求和响应头
    (req as any).requestId = requestId;
    res.setHeader(headerKey, requestId);

    next();
  }
}

