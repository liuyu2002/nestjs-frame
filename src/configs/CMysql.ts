
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import env from 'envparsed'

export const CMysql: TypeOrmModuleOptions = {
    type: "mysql",
    host: env.getStr('DB_HOST', "XXXXXXXXX"),
    port: env.getNumber('DB_PORT', 1000000),
    username: env.getStr('DB_USERNAME', "root"),
    password: env.getStr('DB_PASSWORD', "FairyTail"),
    database: env.getStr('DB_DATABASE', "os2_dev"),
    entities: [
        "dist/**/*.entities{.ts,.js}"
    ],
    logging: false,
    charset: 'utf8mb4',
    synchronize: env.getBoolean('DB_SYNCHRONIZE', false),
    autoLoadEntities: env.getBoolean('DB_AUTOLOADENTITIES', true),
    timezone: "+08:00",

}

