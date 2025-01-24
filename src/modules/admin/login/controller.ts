import { Get, Param, Post, Body, Query, Res, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Service } from './service'
import { EPath } from 'src/common/EPath';
import { MRequest } from '../request';
import { PALogin } from './params';
import { ControllerAdmin } from 'src/modules/min/minController';
import { SkipAuth } from 'src/decorators/skipAuth';

@ApiTags(`${EPath.admin}:登陆`)
@ControllerAdmin('login')

export class Controller {
    constructor(private readonly service: Service) { }

    //登录
    @SkipAuth()
    @ApiOperation({ summary: '登录' })
    @Post()
    codeLogin(@Body() params: PALogin) {
        return this.service.login(params);
    }

}