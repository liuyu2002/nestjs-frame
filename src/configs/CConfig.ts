import env from 'envparsed'


// 监听端口
export const CPort: number = env.getNumber('PORT', 10118)
export const CDebug = env.getBoolean('DEBUG', true)
export const CDoInit = env.getBoolean('DO_INIT', false)
export const CCors: boolean = env.getBoolean('CORS', true)
export const IS_DEBUG: boolean = env.getBoolean('IS_DEBUG', true)
export const CWsConfig = { cors: CCors, allowEIO3: true, transports: ['websocket', 'polling'] }
// 本服务器对外域名
export const CHome: string = env.getStr('DOMAIN', 'https://s2d.orbitsoft.cn/')