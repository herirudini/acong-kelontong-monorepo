import { IsEmail, IsNotEmpty, IsString, MinLength , IsOptional, IsIn} from 'class-validator';
import { Type } from 'class-transformer';
import { logoutOption } from 'src/types/enums';
import type { TLogoutOption } from 'src/types/interfaces';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

export class LogoutDto {
  @IsOptional() // allow missing query param
  @IsIn([Object.values(logoutOption)])
  @Type(() => String) // ensure it's treated as string
  option?: TLogoutOption;
}
