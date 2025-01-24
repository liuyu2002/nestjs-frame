import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { StringOrBuffer } from 'cos-nodejs-sdk-v5';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('Queue') private readonly exampleQueue: Queue// Queue 这里对应job文件下job的Processor名称
    ) { }

    async addJob(data: string) {
        return await this.exampleQueue.add(data, {
            attempts: 3, // 重试次数
            backoff: 5000, // 重试间隔
        });
    }


}
