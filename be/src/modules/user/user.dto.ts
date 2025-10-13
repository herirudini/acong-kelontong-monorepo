import {
  IsBoolean,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';
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
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  role: Types.ObjectId;
}
