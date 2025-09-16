export type TPermission =
    'cashier.view' | 'cashier.create' | 'cashier.edit' | 'cashier.delete' |
    'products.view' | 'products.create' | 'products.edit' | 'products.delete' |
    'brands.view' | 'brands.create' | 'brands.edit' | 'brands.delete' |
    'suppliers.view' | 'suppliers.create' | 'suppliers.edit' | 'suppliers.delete' |
    'income.view' | 'income.create' | 'income.edit' | 'income.delete' |
    'expenses.view' | 'expenses.create' | 'expenses.edit' | 'expenses.delete' |
    'users.view' | 'users.create' | 'users.edit' | 'users.delete'

    // TODO: remove this dummy later
    | 'dashboard.view' |
    'dashboard.update' |
    'dashboard.create' |
    'dashboard-v1.view' |
    'dashboard-v1.update' |
    'dashboard-v1.create' |
    'dashboard-v2.view' |
    'dashboard-v3.view' |
    'tables.view' |
    'tables-simple.view' |
    'forms.view' |
    'forms-general.view';

export interface IMenu {
    code: string;
    url: string;
    icon?: string;
    labelKey?: string;
    permissions?: TPermission[];
    children?: { [key: string]: IMenu };
    mappedChildren?: IMenu[];
    active?: boolean;
}