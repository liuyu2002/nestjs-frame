import { 
    BadRequestException, 
    ForbiddenException, 
    HttpException, 
    HttpStatus, 
    NotFoundException, 
    UnauthorizedException 
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants/EMessage';

export class ErrorResponseBuilder {
    static build(exception: unknown, requestId: string) {
        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorMessage = ERROR_MESSAGES.DEFAULT;

        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            // 处理 `response` 为字符串或对象的情况
            if (typeof response === 'string') {
                errorMessage = response;
            } else if (typeof response === 'object') {
                // 解析嵌套消息
                errorMessage = this.extractMessage(response);
            }

            // 针对具体异常类型的错误消息覆盖
            if (exception instanceof UnauthorizedException) {
                errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            } else if (exception instanceof ForbiddenException) {
                errorMessage = ERROR_MESSAGES.FORBIDDEN;
            } else if (exception instanceof NotFoundException) {
                errorMessage = ERROR_MESSAGES.NOT_FOUND;
            }
            // BadRequestException 保持原有的具体错误信息，不覆盖
        }

        return {
            success: false,
            message: errorMessage,
            errorCode: statusCode,
            requestId,
            timestamp: Date.now(),
            stack: exception instanceof Error ? exception.stack : null,
        };
    }

    // 提取错误消息的辅助方法
    private static extractMessage(response: any): string {
        if (response.message) {
            return Array.isArray(response.message)
                ? response.message.join(', ')
                : response.message;
        }
        return response.error || ERROR_MESSAGES.DEFAULT;
    }
}
