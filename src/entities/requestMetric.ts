import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('request_metrics')
export class RequestMetric {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    method: string;

    @Column()
    path: string;

    @Column()
    statusCode: number;

    @Column('int')
    duration: number;

    @Column({ nullable: true })
    userId?: number;

    @Column()
    userIp: string;

    @Column('text', { nullable: true })
    requestBody?: string;

    @Column('text', { nullable: true })
    responseBody?: string;

    @Column('text', { nullable: true })
    error?: string;

    @CreateDateColumn({
        comment: '创建时间',
        name: 'created_at',
    })
    created_at: Date;
}