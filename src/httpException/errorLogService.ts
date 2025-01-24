import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLog } from '../entities/errorLog';

@Injectable()
export class ErrorLogService {
    constructor(
        @InjectRepository(ErrorLog)
        private readonly errorLogRepository: Repository<ErrorLog>,
    ) {}

    async logError(
        ip: string,
        requestUrl: string,
        requestMethod: string,
        requestParams: string,
        userAgent: string,
        referer: string,
        headers: string,
        errorDescription: string,
        stackTrace: string,
        statusCode: number,
        requestId: string,
    ): Promise<void> {
        try {
            await this.errorLogRepository.save({
                ip,
                request_url: requestUrl,
                request_method: requestMethod,
                request_params: requestParams,
                user_agent: userAgent,
                referer,
                headers,
                error_description: errorDescription,
                stack_trace: stackTrace,
                status_code: statusCode,
                request_id: requestId,
            });
        } catch (error) {
            console.error('Failed to save error log:', error);
        }
    }
}