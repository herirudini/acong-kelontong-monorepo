import { TModules } from './user.interface';

export interface IMenu {
    code: string;
    url: string;
    icon?: string;
    labelKey?: string;
    permissions?: TModules[];
    children?: { [key: string]: IMenu };
    mappedChildren?: IMenu[];
    active?: boolean;
}