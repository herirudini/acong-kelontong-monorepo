import { Type } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export type IRole = 'inventory' | 'finance' | 'cashier';

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
    @IsIn(['all', 'other', 'current'])
    @Type(() => String) // ensure it's treated as string
    role: IRole;
}
