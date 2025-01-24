

import { Module } from '@nestjs/common';
import { Controllers } from './controller';
import { Service } from './service';
import { MulterModule } from '@nestjs/platform-express';
import * as mcx from 'multer-cos-x'
import { CTencentCos } from 'src/configs/CTencent.cos';

@Module({
    imports: [
        MulterModule.register({
            storage: mcx({
                cos: {
                    SecretId: CTencentCos.secretId,
                    SecretKey: CTencentCos.secretKey,
                    Bucket: CTencentCos.bucket,
                    Region: CTencentCos.region,
                    domainProtocol: 'https',
                    // domain: process.env.COS_DOMAIN, 
                    dir: CTencentCos.allowPrefix.replace('/*', ''),
                },
                filename: (req, file, cb) => {
                    const originalname = decodeURI(file.originalname)
                    const uid = Date.now() + Math.random().toString().substring(3, 6)

                    let suffix = originalname.substring(originalname.lastIndexOf('.'))
                    return cb(null, uid + suffix)
                }
            }),
        }),
    ],
    controllers: [Controllers],
    providers: [Service],
})

export class ModuleTencentCos { }