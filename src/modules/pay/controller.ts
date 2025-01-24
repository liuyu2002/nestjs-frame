import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { ICallback as IWechatCallback } from './wechat/lib/interface/common/ICallback';
import { ServiceHandlePay } from "./service";
import servicePayWechat from './wechat/service'
import axios from "axios";
import { CPayWechatHookUrl } from "src/configs/CWechat.pay";

@Controller()
export class ControllerPayHook {
    constructor(
        private readonly serviceHandlePay: ServiceHandlePay,
    ) {

    }




    @Post(CPayWechatHookUrl)
    @HttpCode(200)
    async handleWechatPay(@Body() params: IWechatCallback) {
        let __raw__ = {
            code: "FAIL",
            message: "未定义异常",
        };
        try {
            const { resource, event_type } = params;
            switch (event_type) {
                case 'TRANSACTION.SUCCESS':
                    const res = servicePayWechat.decryptNotify(resource)
                    await this.serviceHandlePay.handleWechatPay(res)
                    break;
                case 'REFUND':
                    break;
            }
        } catch (error) {
            console.log('error:', error);
        } finally {
            __raw__.code = "SUCCESS";
            __raw__.message = "成功";
            return { __raw__ }
        }
    }

  
}