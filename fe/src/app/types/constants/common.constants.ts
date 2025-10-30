export const sessionDays = 7;
export const sessionMinutes = 15;
export const salts = 10
export const errCodes = {
  authGuard: 'GUARD_401'
}

export const DATE_FORMAT = 'dd/MM/yyyy';

export enum SORT_DIR {
  ASC = 'asc',
  DESC = 'desc',
  NONE = ''
}

export const UnitOfMeasure = ["G", "KG", "ML", "L", "PCS", "BOX"];
export type TUOM = 'G' | 'KG' | 'ML' | 'L' | 'PCS' | 'BOX'
