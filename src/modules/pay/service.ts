import { Injectable, Logger } from "@nestjs/common"
import { IPayQueryRes as IPayWechatRes } from './wechat/lib/interface/common/IPayQuery';
import { EPayStatus } from "src/common/EPayStatus";

import { Cron } from "@nestjs/schedule";


import servicePayWechat from './wechat/service'
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user";
import { LessThan, MoreThan, Repository } from "typeorm";



const moment = require('moment')



@Injectable()
export class ServiceHandlePay {
    private readonly delay = 5
    private readonly log = new Logger(this.constructor.name)
    constructor(
    ) {
    }

    /**
     * 获得微信的结果
     * @param res 
     * @returns 
     */
    async handleWechatPay(res: IPayWechatRes) {
        // this.log.log('hhh')
        let status: EPayStatus
        switch (res.trade_state) {
            case 'SUCCESS': status = EPayStatus.AccountPaid; break; //支付成功
            case 'USERPAYING'://用户支付中（仅付款码支付会返回）
            case 'NOTPAY': return;//未支付
            case 'REFUND': status = EPayStatus.Refunded; break;//转入退款
            case 'CLOSED': //已关闭
            case 'REVOKED'://已撤销（仅付款码支付会返回）
            case 'PAYERROR'://支付失败（仅付款码支付会返回）
                status = EPayStatus.Canceled; break;
            default:
                this.log.error('未知支付状态')
                this.log.error(JSON.stringify(res))
                return
        }


       


    }


   
}

