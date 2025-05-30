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

    @Column()
    statusCode: number;

    @Column({ nullable: true })
    error: string;

    @CreateDateColumn()
    timestamp: Date;
}