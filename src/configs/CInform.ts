import env from 'envparsed';

/**
 * Webhook / 通知配置
 */
export const CInform = {
  /** 企业微信、钉钉等 Webhook 地址 */
  webhook: env.getStr('INFORM_WEBHOOK', ''),
  /** 是否启用通知 */
  enabled: env.getBoolean('INFORM_ENABLED', false),
  /** 发送超时时间（毫秒） */
  timeoutMs: env.getNumber('INFORM_TIMEOUT_MS', 5000),
  /** 应用名称前缀，便于区分不同环境的消息 */
  appName: env.getStr('APP_NAME', 'nestjs-frame'),
};
