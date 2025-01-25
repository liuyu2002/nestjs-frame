import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'utils/redis/redisService';

@WebSocketGateway()
export class WebSocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly MAX_IDLE_TIME = Number(process.env.WS_MAX_IDLE_TIME)  * 1000; // 最大闲置时间（30分钟）
  private readonly CHECK_INTERVAL = Number(process.env.WS_CHECK_INTERVAL) * 1000; // 检查间隔（5分钟）
  private idleCheckInterval: NodeJS.Timeout;

  constructor(private readonly redisService: RedisService) {}

  afterInit() {
    // 启动定时任务，检查闲置连接
    this.startIdleCheck();
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const allowedOrigin = process.env.WS_DOMAIN || '*'
    const clientOrigin = client.handshake.headers.origin;
    if (allowedOrigin === '*' || allowedOrigin === clientOrigin) {
      console.log(`Client connected: ${client.id}`);
    } else {
      console.log(`Client from unauthorized origin: ${clientOrigin}`);
      client.disconnect(true); // 强制断开连接
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // 清理断开连接的客户端
    const userId = await this.redisService.get(`ws:client:${client.id}`);
    if (userId) {
      await this.redisService.delete(`ws:user:${userId}`);
      await this.redisService.delete(`ws:client:${client.id}`);
      await this.redisService.delete(`ws:activity:${userId}`);
    }
  }

  @SubscribeMessage('login')
  async handleLogin(@ConnectedSocket() client: Socket, @MessageBody() userId: string): Promise<void> {
    // 检查是否已存在该用户的连接
    const existingClientId = await this.redisService.get(`ws:user:${userId}`);
    if (existingClientId) {
      const existingClient = this.server.sockets.sockets.get(existingClientId);
      if (existingClient) {
        // 向旧客户端发送断开连接的消息
        existingClient.emit('force-disconnect', '您的账号已在其他地方登录，您已被强制下线。');
        // 强制断开旧客户端的连接
        existingClient.disconnect(true); // true 表示强制断开
      }
      await this.redisService.delete(`ws:client:${existingClientId}`);
      await this.redisService.delete(`ws:activity:${userId}`);
    }

    // 存储新连接
    await this.redisService.set(`ws:user:${userId}`, client.id);
    await this.redisService.set(`ws:client:${client.id}`, userId);
    await this.updateUserActivity(userId); // 更新活动时间
  }

  @SubscribeMessage('message')//接收消息 处理消息
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<void> {
    console.log(`Received message: ${data}`);
    const userId = await this.redisService.get(`ws:client:${client.id}`);
    if (userId) {
      await this.updateUserActivity(userId); // 更新活动时间
    }
    this.server.emit('message', data);
  }

  // 更新用户活动时间
  private async updateUserActivity(userId: string): Promise<void> {
    const now = Date.now();
    await this.redisService.set(`ws:activity:${userId}`, now.toString());
  }

  // 启动闲置检查任务
  private startIdleCheck(): void {
    this.idleCheckInterval = setInterval(async () => {
      const now = Date.now();
      const keys = await this.redisService.keys('ws:activity:*');

      for (const key of keys) {
        const userId = key.replace('ws:activity:', '');
        const lastActivity = await this.redisService.get(key);

        if (lastActivity && now - parseInt(lastActivity, 10) > this.MAX_IDLE_TIME) {
          // 强制断开闲置连接
          const clientId = await this.redisService.get(`ws:user:${userId}`);
          if (clientId) {
            this.server.to(clientId).emit('force-disconnect', '由于长时间未进行数据操作，您已被强制下线。');
            this.server.sockets.sockets.get(clientId).disconnect(true);
            await this.redisService.delete(`ws:user:${userId}`);
            await this.redisService.delete(`ws:client:${clientId}`);
            await this.redisService.delete(`ws:activity:${userId}`);
          }
        }
      }
    }, this.CHECK_INTERVAL);
  }

  // 停止闲置检查任务
  private stopIdleCheck(): void {
    if (this.idleCheckInterval) {
      clearInterval(this.idleCheckInterval);
    }
  }

  // 在服务销毁时停止定时任务
  async onModuleDestroy() {
    this.stopIdleCheck();
  }
}