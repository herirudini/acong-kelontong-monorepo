export type TPermission = 'create' | 'view' | 'update' | 'delete';
export interface IMenu {
    code: string;
    url?: string;
    icon?: string;
    labelKey?: string;
    permissions?: TPermission[];
    children?: { [key: string]: IMenu };
    mappedChildren?: IMenu[];
}