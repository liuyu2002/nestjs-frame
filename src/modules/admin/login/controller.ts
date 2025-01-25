import { Get, Param, Post, Body, Query, Res, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Service } from './service'
import { EPath } from 'src/common/EPath';
import { MRequest } from '../request';
import { PALogin } from './params';
import { ControllerAdmin } from 'src/modules/min/minController';
import { SkipAuth } from 'src/decorators/skipAuth';
import { RateLimit } from 'src/decorators/rateLimit';

@ApiTags(`${EPath.admin}:登陆`)
@ControllerAdmin('login')
@ApiBearerAuth()
export class Controller {
    constructor(private readonly service: Service) { }

    //登录
    @SkipAuth()
    @RateLimit(1, 1)
    @ApiOperation({ summary: '登录' })
    @Post()
    codeLogin(@Body() params: PALogin) {
        return this.service.login(params);
    }

    //测试
    @ApiOperation({ summary: '测试' })
    @Get('test')
    test(@Req() req: MRequest) {
        return 123;
    }

}