import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Controller } from './controller';
import { Service } from './service';


@Module({
    imports: [
        TypeOrmModule.forFeature([])
    ],
    controllers: [Controller],
    providers: [Service],
})

export class ModuleWechatEvent { }
