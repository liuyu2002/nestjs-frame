import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express'; // 导入 Express 的类型
import rateLimit from 'express-rate-limit';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { RequestMetric } from 'src/entities/requestMetric';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// 加载 .env 文件
dotenv.config();
/*
 * 记录日志
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name); // 使用 Logger
    private readonly logDir = process.env.LOG_DIR || path.join(__dirname, '../../logs'); // 从环境变量中读取日志目录

    constructor(
        private readonly reflector: Reflector,
        @InjectRepository(RequestMetric)
        private readonly metricRepository: Repository<RequestMetric>,
    ) {
        // 确保日志目录存在
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
            this.logger.log(`日志目录已创建: ${this.logDir}`);
        }
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const startTime = Date.now();

        // 记录请求日志
        this.logRequest(request);


        // 返回 Observable，并在管道中打印响应数据
        return next.handle().pipe(
            tap({
                next: async (responseBody) => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    const statusCode = response.statusCode;

                    // 记录响应日志
                    this.logResponse(request, statusCode, duration, responseBody);

                    // 慢请求警告
                    if (duration >= 1000) {
                        this.logger.warn(
                            `慢请求: ${request.method} ${request.url} ${JSON.stringify(responseBody)} - ${duration / 1000}秒`,
                        );
                        this.writeLogToFile('warn', `慢请求: ${request.method} ${request.url} - ${duration / 1000}秒 \n`);
                    }
                },
                error: async (error) => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;

                    // 记录错误日志
                    this.logError(request, error, duration);
                },
            }),
        );
    }


    /**
     * 记录请求日志
     */
    private logRequest(request: Request) {
        const logMessage = `${new Date().toISOString()} - ${request.method} ${request.url} - ${JSON.stringify(request.body)}\n`;
        this.logger.log(logMessage.trim());
        this.writeLogToFile('log', logMessage);
    }

    /**
     * 记录响应日志
     */
    private logResponse(request: Request, statusCode: number, duration: number, responseBody: any) {
        const logMessage = `${new Date().toISOString()} - ${request.method} ${request.url} ${statusCode} - ${duration / 1000}秒
响应数据: ${JSON.stringify(responseBody)}\n\n`;
        this.logger.log(logMessage.trim());
        this.writeLogToFile('log', logMessage);
    }

    /**
     * 记录错误日志
     */
    private logError(request: Request, error: any, duration: number) {
        const logMessage = `${new Date().toISOString()} - 请求接口错误: ${request.method} ${request.url} - ${duration}ms\n${error.stack}\n`;
        this.logger.error(logMessage.trim());
        this.writeLogToFile('error', logMessage);
    }

    /**
     * 获取用户 IP
     */
    private getUserIp(request: Request): string {
        const ip =
            (request.headers['x-forwarded-for'] as string) ||
            (request.headers['x-real-ip'] as string) ||
            request.socket.remoteAddress ||
            '';

        return ip.split(',')[0].trim();
    }

    /**
     * 安全地序列化对象
     */
    private safeStringify(obj: any): string {
        try {
            return obj ? JSON.stringify(obj) : '';
        } catch (error) {
            return '[Circular]';
        }
    }

    /**
     * 保存请求记录
     */
    private async saveRequestMetric(metric: Partial<RequestMetric>) {
        return await this.metricRepository.save(metric);
    }

    /**
     * 将日志写入文件
     * @param level 日志级别（log 或 error）
     * @param logMessage 日志内容
     */
    private writeLogToFile(level: 'log' | 'error' | 'warn', logMessage: string) {
        const today = new Date().toISOString().split('T')[0]; // 获取当前日期，格式为 YYYY-MM-DD
        const logFilePath = path.join(this.logDir, `${today}-${level}.log`); // 日志文件路径

        // 确保日志目录存在
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }

        // 将日志内容追加到文件
        fs.appendFileSync(logFilePath, logMessage, { encoding: 'utf-8' });
    }
}