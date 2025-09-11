import { IUser } from "./user.interface";

export interface IAuth {
  access_token: string;
  profile: IUser
}

export type TLogoutOption = 'all' | 'other' | 'current';

export interface ICheckboxOption { id: string; label: string; value: boolean }

export interface IDateRangeFilter { start_date: Date | string | number, end_date: Date | string | number }

export interface IPaginationOutput {
  activePage: number,
  selectedSize: number
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