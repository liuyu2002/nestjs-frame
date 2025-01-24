import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './service';
import { DemoJob } from './job/job';

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
        BullModule.registerQueue({
            name: 'Queue',
        }),
    ],
    providers: [QueueService, DemoJob],//多个job 可以在这里注册
    exports: [QueueService], //多个sevice 可以在这里注册
})
export class QueueModule { }
