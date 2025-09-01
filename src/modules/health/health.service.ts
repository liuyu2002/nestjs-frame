import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  // 返回基本运行状态
  ping() {
    return { status: 'ok', timestamp: Date.now() };
  }
}

