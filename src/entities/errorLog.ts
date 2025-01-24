import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Base } from './base';

@Entity('error_log')
export class ErrorLog extends Base {
    @PrimaryGeneratedColumn({
        comment: '日志ID',
    })
    id!: number;

    @Column({
        comment: '请求id',
    })
    request_id!: string;

    @Column({
        comment: '请求IP',
    })
    ip!: string;

    @Column({
        comment: '请求地址',
    })
    request_url!: string;

    @Column({
        comment: '请求方法',
    })
    request_method!: string;

    @Column({
        comment: '请求参数',
        type: 'text',
        nullable: true,
    })
    request_params?: string;

    @Column({
        comment: '用户代理信息',
        nullable: true,
        type: 'text'
    })
    user_agent?: string;

    @Column({
        comment: '来源地址',
        nullable: true,
    })
    referer?: string;

    @Column({
        comment: '请求头',
        type: 'text',
        nullable: true,
    })
    headers?: string;

    @Column({
        comment: '异常描述',
        type: 'text',
    })
    error_description!: string;

    @Column({
        comment: '异常堆栈',
        type: 'text',
        nullable: true,
    })
    stack_trace?: string;

    @Column({
        comment: 'HTTP状态码',
    })
    status_code!: number;


}
