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

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name, { timestamp: true });

    constructor(private readonly errorLogService: ErrorLogService) {}

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
                await this.errorLogService.logError(
                    request.ip,
                    request.url,
                    request.method,
                    requestParams,
                    request.headers['user-agent'] || null,
                    request.headers['referer'] || null,
                    JSON.stringify(request.headers),
                    exception instanceof Error ? exception.message : 'Unknown Error',
                    stackTrace,
                    statusCode,
                    requestId,
                );
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
}