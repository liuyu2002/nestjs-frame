import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

/**
 * 实体管理器服务
 * 提供统一的数据库操作接口
 */
@Injectable()
export class EntityManagerService {
    constructor(private readonly dataSource: DataSource) {}

    /**
     * 获取实体管理器
     */
    get manager(): EntityManager {
        return this.dataSource.manager;
    }

    /**
     * 执行事务
     * @param runInTransaction 事务回调函数
     * @returns 事务执行结果
     */
    async transaction<T>(runInTransaction: (manager: EntityManager) => Promise<T>): Promise<T> {
        return this.dataSource.transaction(runInTransaction);
    }

    /**
     * 创建查询构建器
     * @param entityClass 实体类
     * @param alias 别名
     * @returns 查询构建器
     */
    createQueryBuilder(entityClass: any, alias?: string) {
        return this.manager.createQueryBuilder(entityClass, alias);
    }
}