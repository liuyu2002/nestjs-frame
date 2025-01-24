import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTimer } from './service';
import { User } from 'src/entities/user';
import { RequestMetric } from 'src/entities/requestMetric';



@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([User, RequestMetric]),
    ],
    controllers: [],
    providers: [
        ServiceTimer,
    ],
})

export class ModuleTimer { }
