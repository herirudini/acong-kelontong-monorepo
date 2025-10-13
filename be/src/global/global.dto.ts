import {
    IsArray,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Min,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class FilterDto {
    @IsString()
    column: string;

    @IsString()
    value: string;
}

export class PaginationDto {
    @IsInt()
    @Min(1)
    page?: number;

    @IsInt()
    @Min(1)
    size?: number;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortDir?: 'asc' | 'desc' = 'asc';

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchFields?: string[];

    @IsOptional()
    @ValidateNested()
    @Type(() => FilterDto)
    filter?: FilterDto;
}
