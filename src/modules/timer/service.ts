import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository, Between, Not, getConnection, LessThan, MoreThan } from 'typeorm';
const moment = require('moment');
import { User } from 'src/entities/user';
import { RequestMetric } from 'src/entities/requestMetric';

// 定时器
@Injectable()
export class ServiceTimer {
  constructor(
    @InjectRepository(User)
    private readonly repoUser: Repository<User>,
    @InjectRepository(RequestMetric)
    private readonly repoRequestMetric: Repository<RequestMetric>,
  ) {

  }

  // 每天0点执行
  @Cron('0 0 * * *')
  async handleCron() {
   
    return
  }



}

