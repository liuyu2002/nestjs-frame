import axios from "axios";

export class InformUtil {
    /**
     * 异常通知
     */
    static async error(msg: string) {
        try {
            await axios('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=04da20c5-e69f-4f63-a38a-6303a6e6f43b', {
                method: 'POST',
                data: {
                    "msgtype": "text",
                    "text": {
                        "content": msg
                    }
                }
            })
        } catch (error) {
            console.error(`[error] ${error}`)
        }
    }

    /**
     * DEBUG 通知
     */
    static async debug(msg: string) {
        try {
            await axios('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=04da20c5-e69f-4f63-a38a-6303a6e6f43b', {
                method: 'POST',
                data: {
                    "msgtype": "text",
                    "text": {
                        "content": `[DEBUG] ${msg}`
                    }
                }
            })
        } catch (error) {
            console.error(`[error] ${error}`)
        }
    }
}