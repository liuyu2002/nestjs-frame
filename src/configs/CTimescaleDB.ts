import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import env from 'envparsed'

export const CTimescaleDB: TypeOrmModuleOptions = {
    type: "postgres",
    host: env.getStr('TIMESCALE_HOST', 'localhost'),
    port: env.getNumber('TIMESCALE_PORT', 5432),
    username: env.getStr('TIMESCALE_USERNAME', 'postgres'),
    password: env.getStr('TIMESCALE_PASSWORD'),
    database: env.getStr('TIMESCALE_DATABASE', 'tsdb'),
    entities: [
        "dist/**/TSDB/*.entities{.ts,.js}",
    ],
    logging: true, // 开启详细日志
    synchronize: true,
    extra: {
        timezone: 'Asia/Shanghai'
    },
}