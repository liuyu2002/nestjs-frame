import { IsOptional, IsNumber, Min, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    pageSize?: number = 10;
}

export class BaseResponseDto {
    @IsNumber()
    code: number;

    @IsString()
    message: string;

    @IsOptional()
    data?: any;

    @IsString()
    timestamp: string;
}

export class BaseQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive?: boolean;
} 