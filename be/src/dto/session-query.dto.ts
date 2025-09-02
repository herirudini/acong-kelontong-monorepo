import { IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export type TSession = 'all' | 'other' | 'current';

export class SessionQueryDto {
  @IsOptional() // allow missing query param
  @IsIn(['all', 'other', 'current'])
  @Type(() => String) // ensure it's treated as string
  session?: TSession;
}
