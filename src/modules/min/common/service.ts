import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, MoreThan, Not, Repository } from 'typeorm';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { User } from 'src/entities/user';
const moment = require('moment');
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as COS from 'cos-nodejs-sdk-v5';
import * as iconv from 'iconv-lite';
import { COS_CONFIG } from 'src/configs/CTencent.cos';
import { MediaFile } from 'src/entities/mediaFile';

@Injectable()
export class Service {
  private cos: COS;
  constructor(
    @InjectRepository(User)
    private readonly repoUser: Repository<User>,


    @InjectRepository(MediaFile)
    private readonly repoMediaFile: Repository<MediaFile>,


  ) {
    this.cos = new COS({
      SecretId: COS_CONFIG.secretId,
      SecretKey: COS_CONFIG.secretKey,
    });
  }



  async uploadFileTencent(file: any, userInfo): Promise<any> {
    file.originalname = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8');
    const mediaFile = await this.repoMediaFile.findOne({
      where: {
        name: file.originalname,
        size: file.size,
      }
    });
    if (mediaFile) {
      return mediaFile;
    }
    const currentYear = moment().format('YYYY');
    const currentMonth = moment().format('MM');

    // 使用中文文件名
    const key = `edges/${currentYear}/${currentMonth}/${file.originalname}`;



    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: COS_CONFIG.bucket,
          Region: COS_CONFIG.region,
          Key: key,
          Body: file.buffer,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          const fileinfo = this.repoMediaFile.save({
            type: file.mimetype,
            path: "https://c1.orbitsoft.cn/" + key,
            name: file.originalname,
            size: file.size,
          });
          resolve(fileinfo);
        },
      );
    });
  }

}

