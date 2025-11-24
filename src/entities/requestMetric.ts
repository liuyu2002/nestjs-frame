import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class RequestMetric {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column()
    method: string;

    @Column('float')
    duration: number;

    //请求参数
    @Column({ nullable: true,type:'json' })
    requestParams: any;

    //响应参数
    @Column({ nullable: true,type:'json' })
    responseParams: any;

    //ip
    @Column({ nullable: true })
    ip: string;

    //用户id    
    @Column({ nullable: true })
    userId: number;

    @Column()
    statusCode: number;

    @Column({ nullable: true })
    error: string;

    @CreateDateColumn()
    timestamp: Date;
}