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