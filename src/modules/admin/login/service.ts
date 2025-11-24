import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
    code: number;
    isSuccess: boolean;
    message?: string;
    timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => {
                // 如果 data 是对象且包含 code 字段，则使用该 code
                const hasCode = data && typeof data === 'object' && 'code' in data;
                const responseCode = hasCode ? (data as any).code : 200;
                
                // 如果 data 是对象且包含 message 字段，则使用该 message
                const hasMessage = data && typeof data === 'object' && 'message' in data;
                const responseMessage = hasMessage ? (data as any).message : undefined;
                
                // 从 data 中移除 code 和 message 字段
                let cleanData = data;
                if (hasCode || hasMessage) {
                    cleanData = { ...(data as any) };
                    if (hasCode) {
                        delete cleanData.code;
                    }
                    if (hasMessage) {
                        delete cleanData.message;
                    }
                }
                
                // 检查 cleanData 是否为空对象或空数组
                if (cleanData && typeof cleanData === 'object') {
                    if (Array.isArray(cleanData) && cleanData.length === 0) {
                        cleanData = null;
                    } else if (!Array.isArray(cleanData) && Object.keys(cleanData).length === 0) {
                        cleanData = null;
                    }
                }
                
                const result: any = {
                    data: cleanData,
                    code: responseCode,
                    isSuccess: true,
                    timestamp: new Date().toISOString(),
                };
                
                // 只有当存在 message 时才添加该字段
                if (responseMessage !== undefined) {
                    result.message = responseMessage;
                }
                
                return result;
            }),
        );
    }
} 