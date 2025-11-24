import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseRepositoryService } from './base-repository.service';
import { EntityManagerService } from './entity-manager.service';
import { DataSourceService } from './data-source.service';

/**
 * 通用服务模块
 * 提供全局可用的数据库操作服务
 */
@Module({
    imports: [TypeOrmModule],
    providers: [BaseRepositoryService, EntityManagerService, DataSourceService],
    exports: [BaseRepositoryService, EntityManagerService, DataSourceService],
})
export class ServicesModule {}