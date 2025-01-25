// src/websocket/websocket.module.ts

import { Module } from '@nestjs/common';
import { WebSocketService } from './service';

@Module({
  providers: [WebSocketService], // 更新引用
})
export class WebSocketModule {}