import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * 数据源服务
 * 用于初始化 BaseEntity 的静态方法
 */
@Injectable()
export class DataSourceService implements OnModuleInit {
    constructor(private readonly dataSource: DataSource) {}

    async onModuleInit() {
        // 设置 BaseEntity 的数据源，使其静态方法可以工作
        const { BaseEntity } = await import('typeorm');
        BaseEntity.useDataSource(this.dataSource);
    }
}