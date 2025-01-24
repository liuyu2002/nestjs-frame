import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/admin';
import { EPlatform } from 'src/common/EPlatform';
import { CJwt } from 'src/configs/CJwt';
import { EMessage } from 'src/constants/EMessage';
import { SkipAuth } from 'src/decorators/skipAuth';

@Injectable()
export class AdminGuard implements CanActivate {
    private readonly log = new Logger(AdminGuard.name, { timestamp: true });

    constructor(
        @InjectRepository(Admin)
        private readonly repoAdmin: Repository<Admin>,
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 检查是否标记了 SkipAuth
        const skipAuth = this.reflector.get<boolean>('skipAuth', context.getHandler());
        if (skipAuth) {
            this.log.debug('SkipAuth: 跳过鉴权');
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
            if (platform !== EPlatform.Admin) {
                throw new UnauthorizedException(EMessage.AuthError);
            }

            // 检索用户信息
            const user = await this.repoAdmin.findOne({
                where: { id },
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
            this.log.error('鉴权失败:', error);
            throw new UnauthorizedException(EMessage.TokenIllegal);
        }
    }
}