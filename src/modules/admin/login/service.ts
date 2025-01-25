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
import { RedisService } from 'utils/redis/redisService';
@Injectable()
export class Service {

    constructor(
        @InjectRepository(Admin)
        private readonly repoAdmin: Repository<Admin>,
        private readonly redisService: RedisService,
        public readonly jwtService: JwtService,
        public readonly wechatUtil: WechatUtilService
    ) { }


    async login(params: PALogin) {
        const user = await this.repoAdmin.findOne({ where: { account: params.account} });
        if (!user) {
            throw new BadRequestException('用户不存在');
        }
        if (user.password !== params.password) {
            throw new BadRequestException('密码错误');
        }
        const token = this.jwtService.sign({ id: user.id, platform: EPlatform.Admin });
        return { token, user: user };
    }


    async test() {

    }




    //更新登录时间
    async updateLoginTime(user: User) {

    }

}