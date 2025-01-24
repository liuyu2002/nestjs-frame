import * as fs from 'fs';
import { join } from "path";
// import { WechatPayV3Config } from 'src/modules/pay/wechat/lib/interface';
import { CHome } from './CConfig';
import env from 'envparsed'

const rootDir = join(__dirname, '../..');

export const CPayWechat: any = {
    appId: env.getStr("WECHAT_APPID", 'string'),
    mchId: env.getStr("WECHAT_MCHID", 'string'),
    apiv3: env.getStr("WECHAT_APIV3", 'string'),
    publicCert: '',
    privateKey: 'string',
    userAgent: 'wechatpay/v3',
}

// 支付回调 监听路径
export const CPayWechatHookUrl = env.getStr("WECHAT_HOOKURL", '/hook/wechat/pay');
export const CPayWechatNotifyUrl = CHome + CPayWechatHookUrl;
(() => {
    console.log('微信支付回调地址：', CPayWechatNotifyUrl)
    try {
        CPayWechat.publicCert = fs.readFileSync(join(rootDir, "fixtures/wechatpay/apiclient_cert.pem"), "ascii");
        CPayWechat.privateKey = fs.readFileSync(join(rootDir, "fixtures/wechatpay/apiclient_key.pem"), "ascii");
    } catch (error) {
        console.log(error)
        console.error('微信支付证书不存在！！！')
    }
})()