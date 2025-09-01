import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface LoginPayload {
  userId: string;
  username: string;
  roles?: string[];
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 模拟登录，实际可接入数据库校验
  async login(username: string, password: string) {
    // TODO: 替换为真实用户校验逻辑
    const mockUser: LoginPayload = {
      userId: '1',
      username,
      roles: ['user'],
    };
    const token = await this.jwtService.signAsync(mockUser);
    return { accessToken: token };
  }
}

