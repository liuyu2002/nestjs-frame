/**************************************
@File    :   service.ts
@Time    :   2023/01/19 15:54:18
@Author  :   路拾遗
@Version :   1.0
@Contact :   lk920125@hotmail.com
yarn add qcloud-cos-sts cos-nodejs-sdk-v5 multer-cos-x
***************************************/

import { Injectable, Logger } from "@nestjs/common";
import * as STS from 'qcloud-cos-sts';
import { CTencentCos } from "src/configs/CTencent.cos";
/**
 * 腾讯云：获取文件上传密钥
 */


@Injectable()
export class Service {
    private readonly configs = CTencentCos

    private readonly log = new Logger(this.constructor.name, { timestamp: true, })

    // 获取上传密钥
    async getCredential() {
        // console.log('configs: ', this.configs);
        // 'c1-111111-111' => 'c1-111111'
        // const name = this.configs.bucket.substr(0, this.configs.bucket.lastIndexOf('-'));  // is ok
        const name = this.configs.bucket.replace(/(.*)-(.*)/, '$1') // also is ok
        // console.log('name:', name);
        // 'c1-111111-111' => '111'
        const app = this.configs.bucket.replace(/(.*)-/, '')
        // console.log('app:', app);
        const policy = {
            version: '2.0',
            statement: [
                {
                    action: this.configs.action,
                    effect: 'allow',
                    principal: { qcs: ['*'] },
                    // "qcs::cos:ap-beijing:uid/1250000000:examplebucket-1250000000/"
                    resource: [
                        `qcs::cos:${this.configs.region}:uid/${app}:prefix//${app}/${name}/${this.configs.allowPrefix}`,
                    ],
                },
            ],
        };

        // console.log('policy: ', policy.statement);
        try {
            const res = await STS.getCredential({
                secretId: this.configs.secretId,
                secretKey: this.configs.secretKey,
                proxy: this.configs.proxy,
                durationSeconds: this.configs.durationSeconds,
                policy,
            });

            // console.log('res: ', res);
            return {
                credential: res,
                Bucket: this.configs.bucket,
                Region: this.configs.region,
                allowPrefix: this.configs.allowPrefix.replace('*', ''),
                urlBefore: this.configs.urlBefore,
                urlAfter: this.configs.urlAfter,
            };
        } catch (error) {
            // 网络错误等
            this.log.error(error)
        }
    }


    // 未经证实的接口
    async deleteFiles(files: string[]) {
        const name = this.configs.bucket.replace(/(.*)-(.*)/, '$1')
        const app = this.configs.bucket.replace(/(.*)-/, '')
        const resource = files.map(file => `qcs::cos:${this.configs.region}:uid/${app}:examplebucket-${app}/${file}`)

        const policy = {
            version: 2.0,
            statement: [
                {
                    action: ["name/cos:DeleteObject"],
                    effect: "allow",
                    resource: resource
                }
            ]
        }
    }









}
