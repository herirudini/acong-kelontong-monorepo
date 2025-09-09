import { UserDocument } from "src/modules/user/user.schema";

export interface IRefreshTokenPayload {
  id: string;
  id0: string;
}

export interface ITokenPayload extends IRefreshTokenPayload {
  modules: string[];
}

export interface GlobalVar extends ITokenPayload {
  userAgent: string;
  accesToken: string;
}
export interface TmpUser extends UserDocument {
  tmpPassword: string;
}
export interface IEditUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  modules?: string[];
  role?: string;
}

export type TRole = 'inventory' | 'finance' | 'cashier';

export type TUOM = 'G'|'KG'|'ML'|'L'|'PCS'|'BOX'

export type TLogoutOption = 'all' | 'other' | 'current';
