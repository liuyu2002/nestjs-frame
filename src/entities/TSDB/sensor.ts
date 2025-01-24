import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sensor', { 
    // 指定为时序表
    orderBy: {
        timestamp: 'DESC'
    }
})
export class SensorData {
    @PrimaryColumn('timestamp', { 
        comment: '数据记录时间戳' 
    })
    timestamp: Date;

    @PrimaryColumn('varchar', { 
        length: 50, 
        comment: '传感器唯一标识符' 
    })
    sensor_id: string;

    @Column('float', { 
        comment: '温度值' 
    })
    temperature: number;

    @Column('float', { 
        comment: '湿度值' 
    })
    humidity: number;

    @Column('float', { 
        comment: '压力值' 
    })
    pressure: number;

    @Column('varchar', { 
        length: 50, 
        nullable: true, 
        comment: '设备位置' 
    })
    location: string;

    @Column( { 
        nullable: true, 
        comment: '额外的传感器数据' ,
        type:'json'
    })
    extra_data: object;

    @Column('boolean', { 
        default: true, 
        comment: '数据是否有效' 
    })
    is_valid: boolean;
}
