import { IMenu } from "../interfaces/menu.interface";

export const Menus: { [key: string]: IMenu } = {
    DASHBOARD: {
        code: 'dashboard',
        url: 'home',
        icon: 'nav-icon bi bi-speedometer',
        labelKey: 'Dashboard',
        permissions: ['view', 'create', 'update', 'delete'],
        children: {
            DASHBOARD_V1: {
                code: 'dashboard-v1',
                url: 'dashboard1',
                icon: '',
                labelKey: 'Dashboard v1',
                permissions: ['view', 'create', 'update'],
            },
            DASHBOARD_V2: {
                code: 'dashboard-v2',
                url: 'dashboard2',
                icon: '',
                labelKey: 'Dashboard v2',
                permissions: ['view', 'create'],
            },
            DASHBOARD_V3: {
                code: 'dashboard-v3',
                url: 'dashboard3',
                icon: '',
                labelKey: 'Dashboard v3',
                permissions: ['view'],
            },
        },
    },
    FORMS: {
        code: 'forms',
        url: 'forms',
        icon: 'nav-icon bi bi-pencil-square',
        labelKey: 'Forms',
        permissions: ['view', 'create', 'update', 'delete'],
        children: {
            GENERAL: {
                code: 'forms-general',
                url: 'forms-general',
                labelKey: 'General Elements',
                permissions: ['view', 'create', 'update', 'delete'],
            },
        }
    },
    TABLES: {
        code: 'tables',
        url: 'tables',
        icon: 'nav-icon bi bi-table',
        labelKey: 'Tables',
        permissions: ['view', 'create', 'update', 'delete'],
        children: {
            SIMPLE: {
                code: 'tables-simple',
                url: 'tables-simple',
                labelKey: 'Simple Tables',
                permissions: ['view', 'create', 'update', 'delete'],
            },
        }
    }
};
