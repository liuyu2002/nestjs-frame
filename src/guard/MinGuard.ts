import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { EPlatform } from 'src/common/EPlatform';
import { CJwt } from 'src/configs/CJwt';
import { EMessage } from 'src/constants/EMessage';

const SKIP_AUTH_KEY = 'skipAuth';

@Injectable()
export class MinGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private readonly repoUser: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 检查是否标记了 SkipAuth
        const skipAuth = this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler());
        if (skipAuth) {
            return true; // 允许请求继续
        }

        // 获取请求对象
        const request = context.switchToHttp().getRequest();
        const token = (request.headers['authorization'] || '').replace('Bearer ', '');

        try {
            // 解析 JWT Token
            const tokenData: { id: number; platform: EPlatform } =
                this.jwtService.verify(token, CJwt);
            const { id, platform } = tokenData;

            // 检查平台类型
            if (platform !== EPlatform.Min) {
                throw new UnauthorizedException(EMessage.AuthError);
            }

            // 检索用户信息
            const user = await this.repoUser.findOne({
                where: { id },
                relations: ['company'],
            });
            if (!user) {
                throw new UnauthorizedException(EMessage.AuthError);
            }

            // 将用户信息附加到请求对象
            Object.assign(request, {
                userInfo: user,
                userId: id,
            });

            return true; // 允许请求继续
        } catch (error) {
            throw new UnauthorizedException(EMessage.TokenIllegal);
        }
    }
}