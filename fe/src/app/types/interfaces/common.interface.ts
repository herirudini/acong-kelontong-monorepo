import { IUser } from "./user.interface";

export interface IAuth {
    access_token: string;
    profile: IUser
}

export type TLogoutOption = 'all' | 'other' | 'current';
