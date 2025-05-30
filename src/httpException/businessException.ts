import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
    constructor(
        public readonly code: number,
        public readonly message: string,
        public readonly data?: any,
    ) {
        super(
            {
                code,
                message,
                data,
                timestamp: new Date().toISOString(),
            },
            HttpStatus.OK,
        );
    }
}

export class ValidationException extends BusinessException {
    constructor(message: string) {
        super(400, message);
    }
}

export class UnauthorizedException extends BusinessException {
    constructor(message: string = '未授权访问') {
        super(401, message);
    }
}

export class ForbiddenException extends BusinessException {
    constructor(message: string = '禁止访问') {
        super(403, message);
    }
}

export class NotFoundException extends BusinessException {
    constructor(message: string = '资源不存在') {
        super(404, message);
    }
}

export class ServerException extends BusinessException {
    constructor(message: string = '服务器内部错误') {
        super(500, message);
    }
} 