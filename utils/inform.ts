import axios from 'axios';
import { Logger } from '@nestjs/common';
import { CInform } from 'src/configs/CInform';

export class InformUtil {
  private static readonly logger = new Logger(InformUtil.name, { timestamp: true });

  /**
   * 发送文本通知（自动根据配置开关控制）
   */
  static async send(message: string, prefix: string = 'INFO'): Promise<boolean> {
    if (!CInform.enabled || !CInform.webhook) {
      this.logger.debug(`Inform disabled or webhook missing, skip send: ${message}`);
      return false;
    }

    const payload = {
      msgtype: 'text',
      text: {
        content: `[${prefix}][${CInform.appName}] ${message}`,
      },
    };

    try {
      await axios(CInform.webhook, {
        method: 'POST',
        data: payload,
        timeout: CInform.timeoutMs,
      });
      return true;
    } catch (error) {
      this.logger.error(`send inform failed: ${message}`, error instanceof Error ? error.stack : error);
      return false;
    }
  }

  /**
   * 异常通知
   */
  static async error(msg: string): Promise<boolean> {
    return this.send(msg, 'ERROR');
  }

  /**
   * DEBUG 通知
   */
  static async debug(msg: string): Promise<boolean> {
    return this.send(msg, 'DEBUG');
  }
}
