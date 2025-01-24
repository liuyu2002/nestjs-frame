import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Pagination } from "src/constants/pagination";

export interface IWxMessageXmlData {
    /** 开发者微信号 e.g. `gh_019087f88815`*/
    ToUserName: string;
    /** 发送方帐号（一个OpenID）e.g.: `o5w5awUl***5pIJKY`*/
    FromUserName: string;
    /** 消息创建时间 （整型）e.g.`1595855711` */
    CreateTime: string;
    /** 消息类型，此处为 `event` */
    MsgType: string;
    /** 事件类型，subscribe(订阅)、unsubscribe(取消订阅) */
    Event: 'subscribe' | 'unsubscribe' | 'SCAN' | 'CLICK' | ''  ;
    /** 场景值 判断是否是邀请二维码 */
    EventKey: string;
    /** 二维码的ticket，可用来换取二维码图片 */
    Ticket: string;
    /** 加密 **/
    Encryot: string

}