
import env from 'envparsed'

export enum ERedisDb {
    account = 'account',
    game = 'game',
    core = 'core',
}

export const CRedisBase = {
    password: env.getStr('REDIS_PASSWORD', 'null'),
    host: env.getStr('REDIS_HOST', '127.0.0.1'),
    port: env.getNumber('REDIS_PORT', 6379),
    db: 30
}

export const CRedis = Object.values(ERedisDb).map((name, index) => {
    return {
        ...CRedisBase,
        name,
        db: index
    }
})