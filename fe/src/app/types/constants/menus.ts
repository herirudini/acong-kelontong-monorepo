import { IMenu } from "../interfaces/menu.interface";

export const Menus: { [key: string]: IMenu } = {
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
