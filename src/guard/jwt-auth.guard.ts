import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException as NestUnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

/**
 * JWT 守卫：
 * - 跳过被 `@Public()` 或 `@SkipAuth()` 标记的路由
 * - 校验 Authorization: Bearer <token>
 * - 将解码后的 payload 挂载到 request.user
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new NestUnauthorizedException('缺少授权令牌');
    }

    try {
      const payload = this.jwtService.verify(token);
      (request as any).user = payload;
      return true;
    } catch (error) {
      throw new NestUnauthorizedException('无效或过期的授权令牌');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;
    return token;
  }
}

