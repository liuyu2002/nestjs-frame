import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ErrorLogService } from './errorLogService';
import { ErrorResponseBuilder } from 'utils/error/errorResponseBuilder';
import * as fs from 'fs';
import * as path from 'path';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name, { timestamp: true });
    private readonly logDir = process.env.LOG_DIR || path.join(__dirname, '../../logs'); 
    constructor() { }

    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const requestId = this.generateRequestId();
        const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const stackTrace = exception instanceof Error ? exception.stack : null;
        const requestParams = JSON.stringify(request.body || {});

        // 记录日志
        this.logger.error({
            message: `${request.method} ${request.url} - ${exception instanceof Error ? exception.message : 'Unknown Error'}`,
            stackTrace,
            requestId,
            statusCode,
            requestParams,
            userAgent: request.headers['user-agent'],
            referer: request.headers['referer'],
        });

        // 异步保存错误日志
        setImmediate(async () => {
            try {
                // 记录错误日志到文件
                const logMessage = `${new Date().toISOString()} - 错误日志:
        IP: ${request.ip}
        URL: ${request.url}
        方法: ${request.method}
        请求参数: ${JSON.stringify(requestParams)}
        用户代理: ${request.headers['user-agent'] || '无'}
        来源: ${request.headers['referer'] || '无'}
        请求头: ${JSON.stringify(request.headers)}
        错误消息: ${exception instanceof Error ? exception.message : 'Unknown Error'}
        堆栈跟踪: ${stackTrace}
        状态码: ${statusCode}
        请求ID: ${requestId}\n\n`;
                this.writeLogToFile('error', logMessage);
            } catch (error) {
                this.logger.error('Failed to save error log:', error);
            }
        });

        // 发送响应
        response.status(statusCode).json(ErrorResponseBuilder.build(exception, requestId));
    }

    // 生成唯一的请求ID
    generateRequestId() {
        return uuidv4();
    }

    /**
         * 将日志写入文件
         * @param level 日志级别（debug 或 error）
         * @param logMessage 日志内容
         */
    private writeLogToFile(level: 'debug' | 'error', logMessage: string) {
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