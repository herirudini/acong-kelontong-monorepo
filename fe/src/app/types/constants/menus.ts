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
export const USERS: IMenu = {
    code: 'users',
    url: 'users',
    icon: '',
    labelKey: 'Users',
    permissions: ['users.view', 'users.create', 'users.edit', 'users.delete']
}
export const INVITEUSER: IMenu = {
    code: 'users/form',
    url: 'users/form',
    icon: '',
    labelKey: 'Users',
    permissions: ['users.view', 'users.create', 'users.edit', 'users.delete'],
}

// This is to manage menu UI, please make sure routers are matched
export const Menus: { [key: string]: IMenu } = {
    CASHIER,
    INVENTORY: {
        ...INVENTORY,
        children: {
            PRODUCTS,
            BRANDS,
            SUPPLIERS,
        }
    },
    FINANCE: {
        ...FINANCE,
        children: {
            INCOME,
            EXPENSES,
        }
    },
    ADMIN: {
        ...ADMIN,
        children: {
            USERS: {
                ...USERS,
                children: {
                    INVITEUSER
                }
            }
        }
    },

    // TODO: remove this dummy later
    DASHBOARD: {
        code: 'dashboard',
        url: 'home',
        icon: 'nav-icon bi bi-speedometer',
        labelKey: 'Dashboard',
        children: {
            DASHBOARD_V1: {
                code: 'dashboard-v1',
                url: 'dashboard1',
                icon: '',
                labelKey: 'Dashboard v1',
            },
            DASHBOARD_V2: {
                code: 'dashboard-v2',
                url: 'dashboard2',
                icon: '',
                labelKey: 'Dashboard v2',
                permissions: ['dashboard-v1.view', 'dashboard-v1.create'],
            },
            DASHBOARD_V3: {
                code: 'dashboard-v3',
                url: 'dashboard3',
                icon: '',
                labelKey: 'Dashboard v3',
                permissions: ['dashboard-v1.view'],
            },
        },
    },
    FORMS: {
        code: 'forms',
        url: 'forms',
        icon: 'nav-icon bi bi-pencil-square',
        labelKey: 'Forms',
        children: {
            GENERAL: {
                code: 'forms-general',
                url: 'forms-general',
                labelKey: 'General Elements',
            },
        }
    },
    TABLES: {
        code: 'tables',
        url: 'tables',
        icon: 'nav-icon bi bi-table',
        labelKey: 'Tables',
        children: {
            SIMPLE: {
                code: 'tables-simple',
                url: 'tables-simple',
                labelKey: 'Simple Tables',
            },
        }
    }
};
