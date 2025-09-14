import {
  IsBoolean,
  IsOptional,
  IsEmail,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

import { Type } from 'class-transformer';
import { roles } from 'src/types/enums';

import type { TRole } from 'src/types/interfaces';
import { PaginationDto } from 'src/global/global.dto';

export class GetUserListDto extends PaginationDto {
  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}

export class InviteUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  first_name: string;
  @IsNotEmpty()
  last_name: string;
  @IsNotEmpty({ each: true })
  modules: string[];
  @IsIn([Object.values(roles)])
  @Type(() => String) // ensure it's treated as string
  role: TRole;
}
