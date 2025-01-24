import { Processor, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';

@Processor('Queue')
@Injectable()
export class DemoJob {
    @Process()
    async handleJob(job: Job) {
        console.log('Processing job:', job.id, job.data);
        // 执行任务逻辑
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 模拟处理时间
        console.log('Job completed:', job.id);
    }
}
