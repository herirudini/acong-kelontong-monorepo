export type TModules =
    'cashier.view' | 'cashier.create' | 'cashier.edit' | 'cashier.delete' |
    'products.view' | 'products.create' | 'products.edit' | 'products.delete' |
    'brands.view' | 'brands.create' | 'brands.edit' | 'brands.delete' |
    'suppliers.view' | 'suppliers.create' | 'suppliers.edit' | 'suppliers.delete' |
    'income.view' | 'income.create' | 'income.edit' | 'income.delete' |
    'expenses.view' | 'expenses.create' | 'expenses.edit' | 'expenses.delete' |
    'users.view' | 'users.create' | 'users.edit' | 'users.delete' |
    'roles.view' | 'roles.create' | 'roles.edit' | 'roles.delete'

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
    modules: TModules[]
}

export interface IUser {
    first_name: string;
    last_name: string;
    email?: string;
    verified?: boolean;
    role: IRole;
}