import { Get, Param, Post, Body, Req, Query, UseGuards, Res, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Service } from './service'
import { EPath } from 'src/common/EPath';
import { ControllerMin } from '../minController';
import { Response } from 'express';
import * as crypto from 'crypto';
import { IWxMessageXmlData } from './params';
import { MRequest } from '../request';
import axios from 'axios';
@ApiTags(`${EPath.min}:微信事件路由`)
@ControllerMin('wechatEvent')
export class Controller {
    constructor(private readonly service: Service) { }


    @Get()
    async verifyWechat(
        @Query('signature') signature: string,
        @Query('timestamp') timestamp: string,
        @Query('nonce') nonce: string,
        @Query('echostr') echostr: string,
        @Res() res,
    ) {
        const arr = ['edges', timestamp, nonce];
        arr.sort();
        const str = arr.join('');
        const shasum = crypto.createHash('sha1');
        shasum.update(str);
        const hash = shasum.digest('hex');
        if (hash === signature) {
            res.send(echostr);
        } else {
            res.sendStatus(401);
        }
    }





}