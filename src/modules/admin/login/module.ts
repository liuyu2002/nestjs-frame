import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Controller } from './controller';
import { Service } from './service';
import { JwtModule } from '@nestjs/jwt';
import { CJwt } from 'src/configs/CJwt';
import { User } from 'src/entities/user';

import { Admin } from 'src/entities/admin';
import { RedisModule } from 'utils/redis/redisModule';
import { WechatModule } from 'utils/wechat/wechatModule';
import { ErrorLog } from 'src/entities/errorLog';
import { RequestMetric } from 'src/entities/requestMetric';


@Module({
    imports: [
        TypeOrmModule.forFeature([User, Admin,ErrorLog,RequestMetric]),
        WechatModule,
        RedisModule
    ],
    controllers: [Controller],
    providers: [Service],
})

export class ModuleLogin { }
