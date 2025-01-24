import { IResource } from './lib/interface/common/ICallback';
import { Logger } from "@nestjs/common";
import WechatPay from "./lib/wechatPay";
import { IPayCreateReq } from "./lib/interface/common/IPayCreate";
import { IRefundCreateReq } from "./lib/interface/common/IRefundCreate";
import { TTradeType } from "./lib/interface/common/IPayBase";
import { EMessage } from "src/constants/EMessage";
import { CPayWechat } from 'src/configs/CWechat.pay';


export default new class ServicePayWechat {
    readonly log = new Logger(this.constructor.name, { timestamp: true, })
    readonly wechatPay!: WechatPay;
    constructor(

    ) {
        console.log('ServicePayWechat: V3-------------------------');
        try {
            this.wechatPay = new WechatPay(CPayWechat);
            setInterval(async () => {
                try {
                    await this.wechatPay.updatePlatformCert()
                } catch (error) {
                    // 更新失败
                    this.log.error("微信证书更新失败")
                }
            }, 1000 * 60 * 60 * 10)
        } catch (error) {
            this.log.error(error)
        }
    }

    //查询订单
    async queryTrade(code: string, query: TTradeType) {
        if (!code) throw EMessage.Forbidden
        let url = query === 'out_trade_no'
            ? `pay/transactions/out-trade-no/${code}`
            : `pay/transactions/id/${code}`
        url += '?mchid=' + this.wechatPay.config.mchId
        const res = await this.wechatPay.exec(url, 'GET')
        const data = JSON.parse(res.data)
        // await this.repoLogThird.save({ type: "微信查询订单", detail: { url, data } })
        return data
    }

    //创建订单
    async createTrade(order: IPayCreateReq, type: 'h5' | 'jsapi' | 'app' | 'native') {
        //创建订单
        const url: string = 'pay/transactions/' + type
        const res = await this.wechatPay.exec(url, 'POST', order, true)
        // console.log('res:', res);
        const data = JSON.parse(res.data)
        switch (type) {
            case 'jsapi': {
                const tmp = {
                    appId: this.wechatPay.config.appId,
                    timeStamp: parseInt(+new Date() / 1000 + '').toString(),
                    nonceStr: new Date().getTime() + (Math.random() * 10).toString().substring(3, 9),
                    package: `prepay_id=${data.prepay_id}`,
                    signType: 'RSA',
                    paySign: '',
                };
                const str = [tmp.appId, tmp.timeStamp, tmp.nonceStr, tmp.package, ''].join('\n');
                tmp.paySign = this.wechatPay.sha256WithRsa(str);
                return tmp;
            }
            case 'app': break;
            case 'native': break;
            case 'h5': break;
        }
        return data
    }

    //创建退款
    async createRefund(refund: IRefundCreateReq) {
        const url = 'refund/domestic/refunds'
        const res = await this.wechatPay.exec(url, 'POST', refund, true)
        const data = JSON.parse(res.data)
        return data
    }

    decryptNotify(params: IResource) {
        return this.wechatPay.decryptNotify(params)
    }
}