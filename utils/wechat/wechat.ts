import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import axios from 'axios';
import { RedisService } from '../redis/redisService';
import { CWechat } from 'src/configs/CWechat';
@Injectable()
export class WechatUtilService {
    private readonly log = new Logger('WechatUtil', { timestamp: true });

    constructor(private readonly redisService: RedisService) {
        //延时2S，等待redis连接成功后获取token
        setTimeout(() => {
            this.getToken();
        }, 2000);
        //每个小时重置token
        setInterval(() => {
            this.getAccessToken();
        }, 60 * 60 * 1000);
    }


    async getToken() {
        try {
            const token = await this.getValue('edges:wechat_access_token');
            console.log('token:', token);
            if (token) return token;
            console.log('token已过期，重新获取');
            await this.getAccessToken();
            return await this.getValue('edges:wechat_access_token');
        } catch (error) {
            console.log('获取微信token失败');
            this.log.error('Error getting token', error);
            return null;
        }
    }

    async getAccessToken() {
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${CWechat.appID}&secret=${CWechat.appSecret}`;
        try {
            const { data } = await axios.get(url);
            const { errcode, errmsg, access_token, expires_in = 60 } = data;

            if (errcode) {
                this.log.error(`getAccessToken error ==> code: ${errcode} errmsg: ${errmsg}`);
            } else {
                console.log("获取微信token成功", access_token, expires_in);
                await this.setValue('edges:wechat_access_token', access_token, 3600);
                this.log.log(`ACCESS_TOKEN: ${access_token}`, `EXPIRES: ${3600}`);
            }
        } catch (error) {
            this.log.error('getAccessToken failed', error);
        }
    }

    //code换取手机号
    async getPhoneNumber(code: string) {
        const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${await this.getToken()}`;
        const res = await axios.post(url, {
            code
        });
        return res.data;
    }

    //获取openid
    async getOpenid(code: string) {
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${CWechat.appID}&secret=${CWechat.appSecret}&js_code=${code}&grant_type=authorization_code`;
        const res = await axios.get(url);
        return res.data;
    }

    async setValue(key: string, value: string, expiresInSeconds?: number) {
        const client = this.redisService.getClient();
        try {
            if (expiresInSeconds) {
                await client.set(key, value, 'EX', expiresInSeconds);
            } else {
                await client.set(key, value);
            }
        } catch (error) {
            this.log.error('setValue failed', error);
        }
    }

    async getValue(key: string) {
        const client = this.redisService.getClient();
        try {
            return await client.get(key);
        } catch (error) {
            this.log.error('getValue failed', error);
            return null;
        }
    }
}
