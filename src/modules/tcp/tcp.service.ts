import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as net from 'net';
import { Logger } from '@nestjs/common';

@Injectable()
export class TcpService implements OnModuleInit {
  private readonly logger = new Logger(TcpService.name);
  private server: net.Server;
  private clients: Map<string, net.Socket> = new Map();
  private heartbeatIntervals: Map<string, NodeJS.Timeout> = new Map();
  private readonly HEARTBEAT_INTERVAL = 30000; // 30秒
  private readonly HEARTBEAT_TIMEOUT = 500; // 500毫秒

  onModuleInit() {
    this.startServer();
  }

  private readonly tcpPort: number;

  constructor(private configService: ConfigService) {
    this.tcpPort =process.env.TCP_PORT? parseInt(this.configService.get('TCP_PORT')): 3000;
  }

  private startServer() {
    this.server = net.createServer((socket) => {
      const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
      this.logger.log(`客户端连接: ${clientId}`);
      
      this.clients.set(clientId, socket);
      this.startHeartbeat(clientId, socket);

      let buffer = '';
      
      socket.on('data', (data) => {
        buffer += data.toString();
        
        // 按换行符分割消息
        const messages = buffer.split('\n');
        buffer = messages.pop() || ''; // 保留最后一个不完整的消息

        messages.forEach(msg => {
          if (msg) {
            this.handleMessage(clientId, socket, msg.trim());
          }
        });
      });

      socket.on('error', (error) => {
        this.logger.error(`客户端错误 ${clientId}: ${error.message}`);
      });

      socket.on('close', () => {
        this.logger.log(`客户端断开连接: ${clientId}`);
        this.cleanup(clientId);
      });
    });

    this.server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        this.logger.error(`端口 ${this.tcpPort} 已被占用，请检查端口配置或关闭占用的程序`);
      } else {
        this.logger.error(`TCP服务器错误: ${error.message}`);
      }
    });

    try {
      this.server.listen(this.tcpPort, () => {
        this.logger.log(`TCP服务器启动在端口${this.tcpPort}`);
      });
    } catch (error) {
      this.logger.error(`TCP服务器启动失败: ${error.message}`);
    }
  }

  private handleMessage(clientId: string, socket: net.Socket, message: string) {
    try {
      this.logger.log(`收到消息: ${message}`);
      const msg = JSON.parse(message);
      
      switch (msg.action) {
        case 'heartbeat':
          this.handleHeartbeat(socket, msg);
          break;
        case 'code':
          this.handleCode(socket, msg);
          break;
        case 'getRule':
          this.handleGetRule(socket);
          break;
        default:
          this.sendError(socket, 'E400', '未知的操作类型');
      }
    } catch (error) {
      this.logger.error(`消息处理错误: ${error.message}`);
      this.sendError(socket, 'E400', '无效的请求格式');
    }
  }

  private handleHeartbeat(socket: net.Socket, msg: any) {
    const response = {
      success: true,
      data: {
        timestamp: Math.floor(Date.now() / 1000)
      }
    };
    this.sendResponse(socket, response);
  }

  private handleCode(socket: net.Socket, msg: any) {
    const { seriesNo, code, timestamp } = msg.data;
    
    // 验证流水号格式
    if (!/^[0-9]{20}$/.test(seriesNo)) {
      console.log(seriesNo)
      return this.sendError(socket, 'E401', '无效的流水号格式');
    }

    // TODO: 处理刻码业务逻辑

    const response = {
      success: true,
      code: this.generateRandomCode(16),
      timestamp: Date.now(),
      seriesNo: seriesNo,
    };
    this.sendResponse(socket, response);
  }

  //随机生成16位随机数
  private generateRandomCode(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength)); 
    }
    return result;
  }

  private handleGetRule(socket: net.Socket) {
    // TODO: 从数据库获取规则配置
    const response = {
      success: true,
      data: {
        codeProduct: [],
        product: [],
        rule: []
      }
    };
    this.sendResponse(socket, response);
  }

  private startHeartbeat(clientId: string, socket: net.Socket) {
    const interval = setInterval(() => {
      const request = {
        action: 'heartbeat',
        data: {
          timestamp: Math.floor(Date.now() / 1000)
        }
      };
      
      this.sendResponse(socket, request);
      
      let timeoutCount = 0;
      const checkResponse = setInterval(() => {
        timeoutCount++;
        if (timeoutCount >= 3) {
          this.logger.warn(`客户端 ${clientId} 心跳超时`);
          socket.destroy();
          clearInterval(checkResponse);
        }
      }, this.HEARTBEAT_TIMEOUT);

      socket.once('data', () => {
        clearInterval(checkResponse);
      });
    }, this.HEARTBEAT_INTERVAL);

    this.heartbeatIntervals.set(clientId, interval);
  }

  private cleanup(clientId: string) {
    const heartbeatInterval = this.heartbeatIntervals.get(clientId);
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      this.heartbeatIntervals.delete(clientId);
    }
    this.clients.delete(clientId);
  }

  private sendResponse(socket: net.Socket, data: any) {
    socket.write(JSON.stringify(data) + '\n');
  }

  private sendError(socket: net.Socket, errorCode: string, message: string) {
    const response = {
      success: false,
      errorCode,
      message
    };
    this.sendResponse(socket, response);
  }

  // 公开方法：向指定客户端发送规则
  async postRule(clientId: string, rules: any) {
    const socket = this.clients.get(clientId);
    if (!socket) {
      throw new Error('客户端未连接');
    }

    const request = {
      action: 'postRule',
      data: rules
    };
    this.sendResponse(socket, request);
  }

  // 获取所有连接的客户端
  getConnectedClients(): string[] {
    return Array.from(this.clients.keys());
  }
}