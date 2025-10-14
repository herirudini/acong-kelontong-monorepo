export type TModules =
    'cashier.view' | 'cashier.create' | 'cashier.edit' | 'cashier.delete' |
    'product.view' | 'product.create' | 'product.edit' | 'product.delete' |
    'brand.view' | 'brand.create' | 'brand.edit' | 'brand.delete' |
    'supplier.view' | 'supplier.create' | 'supplier.edit' | 'supplier.delete' |
    'income.view' | 'income.create' | 'income.edit' | 'income.delete' |
    'expenses.view' | 'expenses.create' | 'expenses.edit' | 'expenses.delete' |
    'user.view' | 'user.create' | 'user.edit' | 'user.delete' |
    'role.view' | 'role.create' | 'role.edit' | 'role.delete'

    // TODO: remove this dummy later
    | 'dashboard.view' |
    'dashboard.edit' |
    'dashboard.create' |
    'dashboard-v1.view' |
    'dashboard-v1.edit' |
    'dashboard-v1.create' |
    'dashboard-v2.view' |
    'dashboard-v3.view' |
    'tables.view' |
    'tables-simple.view' |
    'forms.view' |
    'forms-general.view';

export interface IRole {
    _id?: string,
    role_name: string,
    active: boolean,
    modules: TModules[]
}

export interface IUser {
    _id?: string;
    first_name: string;
    last_name: string;
    email?: string;
    verified?: boolean;
    role: IRole;
}