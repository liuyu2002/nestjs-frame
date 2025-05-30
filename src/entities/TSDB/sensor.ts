import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sensor_metrics' })
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  device_id: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'double precision' })
  temperature: number;

  @Column({ type: 'double precision' })
  humidity: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
