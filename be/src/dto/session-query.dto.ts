import { IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { logoutOption } from 'src/types/enums';
import type { TLogoutOption } from 'src/types/interfaces';

export class SessionQueryDto {
  @IsOptional() // allow missing query param
  @IsIn([Object.values(logoutOption)])
  @Type(() => String) // ensure it's treated as string
  type?: TLogoutOption;
}
