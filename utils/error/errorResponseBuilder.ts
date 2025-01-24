import { BadRequestException, ForbiddenException, HttpException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
            if (typeof response === 'object' && (response as any).message) {
                errorMessage = Array.isArray((response as any).message)
                    ? (response as any).message.join(', ')
                    : (response as any).message;
            } else if (exception instanceof BadRequestException) {
                errorMessage = ERROR_MESSAGES.BAD_REQUEST;
            } else if (exception instanceof UnauthorizedException) {
                errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            } else if (exception instanceof ForbiddenException) {
                errorMessage = ERROR_MESSAGES.FORBIDDEN;
            } else if (exception instanceof NotFoundException) {
                errorMessage = ERROR_MESSAGES.NOT_FOUND;
            }
        }

        return {
            success: false,
            message: errorMessage,
            errorCode: statusCode,
            requestId,
            timestamp: Date.now(),
        };
    }
}