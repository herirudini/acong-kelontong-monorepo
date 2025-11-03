export const sessionDays = 7;
export const sessionMinutes = 15;
export const salts = 10
export const errCodes = {
  authGuard: 'GUARD_401'
}

export const DATE_FORMAT = 'dd/MM/yyyy';
export const CURRENCY_FORMAT = 'IDR';

export enum SORT_DIR {
  ASC = 'asc',
  DESC = 'desc',
  NONE = ''
}

export const UnitOfMeasure = ["G", "KG", "ML", "L", "PCS", "BOX"];
export type TUOM = 'G' | 'KG' | 'ML' | 'L' | 'PCS' | 'BOX'

export const TenMegaByte: number = 10 * 1024 * 1024;
