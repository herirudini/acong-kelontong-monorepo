import { IMenu } from "../interfaces/menu.interface";

export const Menus: { [key: string]: IMenu } = {
    CASHIER: {
        code: 'cashier',
        url: 'cashier',
        icon: 'nav-icon bi bi-cart3',
        labelKey: 'Cashier',
        permissions: ['cashier.view', 'cashier.create', 'cashier.update', 'cashier.delete'],
    },
    INVENTORY: {
        code: 'inventory',
        url: 'inventory',
        icon: 'nav-icon bi bi-box-seam',
        labelKey: 'Inventory',
        permissions: ['inventory.view', 'inventory.create', 'inventory.update', 'inventory.delete'],
        children: {
            PRODUCTS: {
                code: 'products',
                url: 'products',
                icon: '',
                labelKey: 'Products',
                permissions: ['products.view', 'products.create', 'products.update', 'products.delete'],
            },
            BRANDS: {
                code: 'brands',
                url: 'brands',
                icon: '',
                labelKey: 'Brands',
                permissions: ['brands.view', 'brands.create', 'brands.update', 'brands.delete'],
            },
            SUPPLIERS: {
                code: 'suppliers',
                url: 'suppliers',
                icon: '',
                labelKey: 'Suppliers',
                permissions: ['suppliers.view', 'suppliers.create', 'suppliers.update', 'suppliers.delete'],
            },
        }
    },
    FINANCE: {
        code: 'finance',
        url: 'finance',
        icon: 'nav-icon bi bi-coin',
        labelKey: 'Finance',
        permissions: ['finance.view', 'finance.create', 'finance.update', 'finance.delete'],
        children: {
            INCOME: {
                code: 'income',
                url: 'income',
                icon: '',
                labelKey: 'Income',
                permissions: ['income.view', 'income.create', 'income.update', 'income.delete'],
            },
            EXPENSES: {
                code: 'expenses',
                url: 'expenses',
                icon: '',
                labelKey: 'Expenses',
                permissions: ['expenses.view', 'expenses.create', 'expenses.update', 'expenses.delete'],
            },
        }
    },
    ADMIN: {
        code: 'admin',
        url: 'admin',
        icon: 'nav-icon bi bi-person-gear',
        labelKey: 'Admin',
        permissions: ['admin.view', 'admin.create', 'admin.update', 'admin.delete'],
        children: {
            USERS: {
                code: 'users',
                url: 'users',
                icon: '',
                labelKey: 'Users',
                permissions: ['users.view', 'users.create', 'users.update', 'users.delete'],
            }
        }
    },
    DASHBOARD: {
        code: 'dashboard',
        url: 'home',
        icon: 'nav-icon bi bi-speedometer',
        labelKey: 'Dashboard',
        permissions: ['dashboard.view', 'dashboard.create', 'dashboard.update', 'dashboard.delete'],
        children: {
            DASHBOARD_V1: {
                code: 'dashboard-v1',
                url: 'dashboard1',
                icon: '',
                labelKey: 'Dashboard v1',
                permissions: ['dashboard-v1.view', 'dashboard-v1.create', 'dashboard-v1.update'],
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
        permissions: ['forms.view', 'forms.create', 'forms.update', 'forms.delete'],
        children: {
            GENERAL: {
                code: 'forms-general',
                url: 'forms-general',
                labelKey: 'General Elements',
                permissions: ['forms-general.view', 'forms-general.create', 'forms-general.update', 'forms-general.delete'],
            },
        }
    },
    TABLES: {
        code: 'tables',
        url: 'tables',
        icon: 'nav-icon bi bi-table',
        labelKey: 'Tables',
        permissions: ['tables.view', 'tables.create', 'tables.update', 'tables.delete'],
        children: {
            SIMPLE: {
                code: 'tables-simple',
                url: 'tables-simple',
                labelKey: 'Simple Tables',
                permissions: ['tables.view', 'tables.create', 'tables.update', 'tables.delete'],
            },
        }
    }
};
