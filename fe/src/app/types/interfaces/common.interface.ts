import { IUser } from "./user.interface";

export interface IAuth {
  access_token: string;
  profile: IUser
}

export type TLogoutOption = 'all' | 'other' | 'current';

export interface ICheckboxOption { id: string; label: string; value: boolean }

export interface IDateRangeFilter { start_date: Date | string | number, end_date: Date | string | number }

export type TSortDir = 'asc' | 'desc' | '';
export interface ISort {
  sortBy: string, sortDir: TSortDir
}
export interface IPaginationOutput {
  page: number,
  size: number
}

export interface IPaginationInput extends IPaginationOutput {
  total: number,
  totalPages: number
}

export interface ISelectFilter {
  id: string
  labelKey: string;
  placeholder: string;
  selectedData: ISelectValue;
  selectLabel: string;
  selectValue: string;
  selectOption: any[];
}

export interface ISelectValue {
  id: string;
  selectedData: string;
}

export interface IResponse<T> {
  message?: string;
  list?: T[];
  detail?: T;
  error_code?: string;
  meta?: IPaginationInput;
}