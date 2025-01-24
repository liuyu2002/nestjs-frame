import env from 'envparsed'
import { CPort } from './CConfig'

export const CWechat = {
    // 小程序ID
    appID: env.getStr('WECHAT_APPID', 'xxxxxxxxxxxxxx'),
    // 小程序密钥
    appSecret: env.getStr('WECHAT_APPSECRET', 'XXXXXXXXXX')

}

export const CWechatUrl = env.getStr('WECHAT_ACCESS_URL', `http://127.0.0.1:${CPort}/access_token`)
export const CWechatStatus = env.getBoolean('WECHAT_ACCESS_STATUS', false)