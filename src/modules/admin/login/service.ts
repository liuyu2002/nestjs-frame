import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { EPlatform } from 'src/common/EPlatform';
import { log } from 'console';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { PALogin } from './params';


import { User } from 'src/entities/user';
import { Admin } from 'src/entities/admin';
import { WechatUtilService } from 'utils/wechat/wechat';
@Injectable()
export class Service {

    constructor(
        @InjectRepository(Admin)
        private readonly repoUser: Repository<Admin>,

        public readonly jwtService: JwtService,
        public readonly wechatUtil: WechatUtilService
    ) { }


    async login(params: PALogin) {
        return 123
    }


    async test() {

    }




    //更新登录时间
    async updateLoginTime(user: User) {

    }

}