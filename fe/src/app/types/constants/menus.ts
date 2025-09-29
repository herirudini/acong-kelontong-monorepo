import { IMenu } from "../interfaces/menu.interface";

// IMPORTANT NOTES: 
// UI management of Menu is managed by FE, whether it'd be child or independent, its up to FE.
// Permission from BE only to flag if particular module is eligible tobe shown

export const CASHIER: IMenu = {
    code: 'cashier',
    url: 'cashier',
    icon: 'nav-icon bi bi-cart3',
    labelKey: 'Cashier',
    permissions: ['cashier.view', 'cashier.create', 'cashier.edit', 'cashier.delete'],
};

export const INVENTORY: IMenu = {
    code: 'inventory',
    url: 'inventory',
    icon: 'nav-icon bi bi-box-seam',
    labelKey: 'Inventory',
}
export const PRODUCTS: IMenu = {
    code: 'products',
    url: 'products',
    icon: '',
    labelKey: 'Products',
    permissions: ['products.view', 'products.create', 'products.edit', 'products.delete'],
}
export const BRANDS: IMenu = {
    code: 'brands',
    url: 'brands',
    icon: '',
    labelKey: 'Brands',
    permissions: ['brands.view', 'brands.create', 'brands.edit', 'brands.delete'],
}
export const SUPPLIERS: IMenu = {
    code: 'suppliers',
    url: 'suppliers',
    icon: '',
    labelKey: 'Suppliers',
    permissions: ['suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete'],
}

export const FINANCE: IMenu = {
    code: 'finance',
    url: 'finance',
    icon: 'nav-icon bi bi-coin',
    labelKey: 'Finance',
}
export const INCOME: IMenu = {
    code: 'income',
    url: 'income',
    icon: '',
    labelKey: 'Income',
    permissions: ['income.view', 'income.create', 'income.edit', 'income.delete'],
}
export const EXPENSES: IMenu = {
    code: 'expenses',
    url: 'expenses',
    icon: '',
    labelKey: 'Expenses',
    permissions: ['expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete'],
}

export const ADMIN: IMenu = {
    code: 'admin',
    url: 'admin',
    icon: 'nav-icon bi bi-person-gear',
    labelKey: 'Admin',
}
export const ROLES: IMenu = {
    code: 'roles',
    url: 'roles',
    icon: '',
    labelKey: 'Roles',
    permissions: ['roles.view', 'roles.create', 'roles.edit', 'roles.delete']
}
export const ROLE_DETAIL: IMenu = {
    code: 'form',
    url: 'form/:role_id',
    icon: '',
    labelKey: 'Role Detail',
    permissions: ['roles.view'],
}
export const ROLE_CREATE: IMenu = {
    code: 'form',
    url: 'form',
    icon: '',
    labelKey: 'Role Create',
    permissions: ['roles.view', 'roles.create'],
}
export const ROLE_EDIT: IMenu = {
    code: 'form',
    url: 'form/:role_id',
    icon: '',
    labelKey: 'Role Edit',
    permissions: ['roles.view', 'roles.edit'],
}

export const USERS: IMenu = {
    code: 'users',
    url: 'users',
    icon: '',
    labelKey: 'Users',
    permissions: ['users.view', 'users.create', 'users.edit', 'users.delete']
}

export const DASHBOARD: IMenu = {
    code: 'dashboard',
    url: 'home',
    icon: 'nav-icon bi bi-speedometer',
    labelKey: 'Dashboard',
    permissions: ['dashboard.view']
}

// This is to manage menu UI, please make sure routers are matched
export const Menus: IMenu[] = [
    // TODO: remove this dummy later
    DASHBOARD,
    CASHIER,
    {
        ...INVENTORY,
        children: [
            PRODUCTS,
            BRANDS,
            SUPPLIERS,
        ]
    },
    {
        ...FINANCE,
        children: [
            INCOME,
            EXPENSES,
        ]
    },
    {
        ...ADMIN,
        children: [
            {
                ...ROLES,
                children: [
                    ROLE_DETAIL,
                    ROLE_CREATE,
                    ROLE_EDIT
                ]
            },
            USERS
        ]
    }
];
