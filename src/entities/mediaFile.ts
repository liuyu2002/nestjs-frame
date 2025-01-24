import { Column, Entity, Index } from "typeorm";
import { Base } from "./base";
@Entity()
export class MediaFile extends Base {

    @Index()
    @Column({
        comment: '文件名',
        type: 'varchar',
        length: 255
    })
    name!: string

    @Column({
        comment: '文件路径',
        type: 'varchar',
        length: 255
    })
    path!: string

    @Index()
    @Column({
        comment: '文件类型',
        type: 'varchar',
        length: 255
    })
    type!: string

    @Column({
        comment: '文件大小',
        type: 'int',
    })
    size!: number

    @Column({
        comment: 'uuid',
        type: 'varchar',
        nullable: true
    })
    uuid?: string
}