import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IPagination } from "src/common/IPagination";


export class Pagination implements IPagination {
    @IsOptional()
    @ApiProperty({ name: "current", type: Number, required: false })
    current?: number;

    @IsOptional()
    @ApiProperty({ name: "pageSize", type: Number, required: false })
    pageSize?: number;
    
    @IsOptional()
    @ApiProperty({ name: "order", type: Number, required: false })
    order?: string;

    @IsOptional()
    @ApiProperty({ name: "desc", type: Boolean, required: false ,description:"string类型bool，true为倒序，false正序"})
    desc?: boolean;
}

export function getPagination<T extends Pagination>(pagination: T) {
    let { current = 1, pageSize = 10 } = pagination
    current = Number(current)
    pageSize = Number(pageSize)
    const skip = (current - 1) * pageSize
    return {
        current,
        pageSize,
        skip,
        take: pageSize,
        order: pagination.order || null,
        desc: pagination.desc,
    }
}