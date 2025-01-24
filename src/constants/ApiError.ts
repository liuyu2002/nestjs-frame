export enum ApiResError {
    AuthSuccess = 'ApiResError:AuthSuccess',               // 验证成功
    // 全局的错误提示
    CommonMessage = 'ApiResError:CommonMessage',
    // 用户端收到此消息，应立刻断开连接
    CrowdedOffline = 'ApiResError:CrowdedOffline',        // 被挤下线
    TokenDisabled = 'ApiResError:TokenDisabled',          // token失效，请重新登陆
}

export interface IResErrorMessage {
    message: string
}