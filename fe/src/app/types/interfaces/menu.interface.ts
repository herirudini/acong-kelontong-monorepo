export interface IMenu {
    code: string;
    url: string;
    icon?: string;
    labelKey?: string;
    permissions?: string[];
    children?: { [key: string]: IMenu };
    mappedChildren?: IMenu[];
    active?: boolean;
}