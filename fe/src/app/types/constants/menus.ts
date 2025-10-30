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


export const CATALOGUE: IMenu = {
    code: 'catalogue',
    url: 'catalogue',
    icon: 'nav-icon bi bi-journals',
    labelKey: 'Catalogue',
}
export const PRODUCT: IMenu = {
    code: 'product',
    url: 'product',
    icon: '',
    labelKey: 'Products',
    permissions: ['product.view', 'product.create', 'product.edit', 'product.delete'],
}
export const BRANDS: IMenu = {
    code: 'brand',
    url: 'brand',
    icon: '',
    labelKey: 'Brands',
    permissions: ['brand.view', 'brand.create', 'brand.edit', 'brand.delete'],
}
export const SUPPLIERS: IMenu = {
    code: 'supplier',
    url: 'supplier',
    icon: '',
    labelKey: 'Suppliers',
    permissions: ['supplier.view', 'supplier.create', 'supplier.edit', 'supplier.delete'],
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
export const ROLE: IMenu = {
    code: 'role',
    url: 'role',
    icon: '',
    labelKey: 'Role',
    permissions: ['role.view', 'role.create', 'role.edit', 'role.delete']
}
export const ROLE_DETAIL: IMenu = {
    code: 'form',
    url: 'form/:role_id',
    icon: '',
    labelKey: 'Role Detail',
    permissions: ['role.view'],
}
export const ROLE_CREATE: IMenu = {
    code: 'form',
    url: 'form',
    icon: '',
    labelKey: 'Role Create',
    permissions: ['role.view', 'role.create'],
}
export const ROLE_EDIT: IMenu = {
    code: 'form',
    url: 'form/:role_id',
    icon: '',
    labelKey: 'Role Edit',
    permissions: ['role.view', 'role.edit'],
}

export const USER: IMenu = {
    code: 'user',
    url: 'user',
    icon: '',
    labelKey: 'User',
    permissions: ['user.view', 'user.create', 'user.edit', 'user.delete']
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
        ...CATALOGUE,
        children: [
            PRODUCT,
            BRANDS,
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
                ...ROLE,
                children: [
                    ROLE_DETAIL,
                    ROLE_CREATE,
                    ROLE_EDIT
                ]
            },
            USER
        ]
    }
];
