import { Type } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { roles } from 'src/types/enums';

import type { TRole } from 'src/types/interfaces'

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
