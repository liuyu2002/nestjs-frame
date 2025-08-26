import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository, Between, Not, getConnection, LessThan, MoreThan } from 'typeorm';
const moment = require('moment');
import { User } from 'src/entities/user';
import { RequestMetric } from 'src/entities/requestMetric';
import path from 'path';
import fs from 'fs';
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
  //删除30天以前的日志文件
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteLogFileBefore30Days() {
    try {
      const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
      // 获取日志文件夹路径（相对于项目根目录）
      const logDir = path.join(process.cwd(), 'logs');
      
      // 检查日志文件夹是否存在
      if (!fs.existsSync(logDir)) {
        console.log('日志文件夹不存在，跳过清理');
        return;
      }
      
      // 获取日志文件夹下的所有文件
      const files = fs.readdirSync(logDir);
      let deletedCount = 0;
      
      // 删除30天以前的日志文件
      files.forEach(file => {
        const filePath = path.join(logDir, file);
        
        try {
          // 获取文件状态
          const stats = fs.statSync(filePath);
          
          // 检查是否是文件且修改时间超过30天
          if (stats.isFile() && stats.mtime < thirtyDaysAgo) {
            fs.unlinkSync(filePath);
            deletedCount++;
            console.log(`已删除过期日志文件: ${file}`);
          }
        } catch (error) {
          console.error(`删除文件 ${file} 时出错:`, error.message);
        }
      });
      
      console.log(`日志清理完成，共删除 ${deletedCount} 个过期文件`);
    } catch (error) {
      console.error('清理日志文件时发生错误:', error.message);
    }
  }



}

