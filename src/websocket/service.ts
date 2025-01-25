// src/websocket/websocket.gateway.ts

import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // 允许所有域名跨域访问，生产环境中应限制为特定域名
  },
})
export class WebSocketService {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): void {
    console.log(`Received message: ${data}`);
    this.server.emit('message', data); // 广播消息给所有客户端
  }
}