import { Injectable } from '@nestjs/common';
import { DataSource, Repository, EntityTarget } from 'typeorm';

/**
 * 通用 Repository 服务
 * 提供统一的数据库操作接口，避免在每个 Service 中注入多个 Repository
 */
@Injectable()
export class BaseRepositoryService {
    constructor(private readonly dataSource: DataSource) {}

    /**
     * 获取指定实体的 Repository
     * @param entity 实体类
     * @returns Repository 实例
     */
    getRepository<T>(entity: EntityTarget<T>): Repository<T> {
        return this.dataSource.getRepository(entity);
    }

    /**
     * 通用查询方法
     * @param entity 实体类
     * @param options 查询选项
     * @returns 查询结果
     */
    async findOne<T>(entity: EntityTarget<T>, options: any): Promise<T | null> {
        const repository = this.getRepository(entity);
        return repository.findOne(options);
    }

    /**
     * 通用查询多个方法
     * @param entity 实体类
     * @param options 查询选项
     * @returns 查询结果数组
     */
    async find<T>(entity: EntityTarget<T>, options?: any): Promise<T[]> {
        const repository = this.getRepository(entity);
        return repository.find(options);
    }

    /**
     * 通用保存方法
     * @param entity 实体类
     * @param data 数据
     * @returns 保存结果
     */
    async save<T>(entity: EntityTarget<T>, data: T): Promise<T> {
        const repository = this.getRepository(entity);
        return repository.save(data);
    }

    /**
     * 通用删除方法
     * @param entity 实体类
     * @param id 主键ID
     * @returns 删除结果
     */
    async delete<T>(entity: EntityTarget<T>, id: number): Promise<void> {
        const repository = this.getRepository(entity);
        await repository.delete(id);
    }

    /**
     * 通用更新方法
     * @param entity 实体类
     * @param id 主键ID
     * @param data 更新数据
     * @returns 更新结果
     */
    async update<T>(entity: EntityTarget<T>, id: number, data: any): Promise<void> {
        const repository = this.getRepository(entity);
        await repository.update(id, data);
    }
}