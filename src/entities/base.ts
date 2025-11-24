import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from "typeorm"


export class Base extends BaseEntity{ //基础表 用于继承
    @PrimaryGeneratedColumn({
        comment: '主键-自增',
    })
    id!: number

    @Column({
        comment: '备注',
        nullable: true,
    })
    remark!: string

    @CreateDateColumn({
        comment: '创建时间',
        name: 'created_at',
    })
    created_at!: Date

    @UpdateDateColumn({
        comment: '更新时间',
        name: 'updated_at'
    })
    updated_at!: Date

    @DeleteDateColumn({
        comment: '删除时间',
        name: 'deleted_at',
    })
    deleted_at?: Date


}