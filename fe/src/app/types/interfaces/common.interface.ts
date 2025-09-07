import { IUser } from "./user.interface";

export interface IAuth {
    access_token: string;
    profile: IUser
}