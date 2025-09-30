import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/global/global.dto';

export class GetRolesDTO extends PaginationDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}