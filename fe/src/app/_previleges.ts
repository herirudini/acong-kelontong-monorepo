import { Injectable } from '@angular/core';
import { Menus } from './types/constants/menus';
import { IMenu, TPermission } from './types/interfaces/menu.interface';
import { AuthService } from './services/auth/auth-service';

@Injectable()
export class Previleges {
    constructor(private authSvc: AuthService) { }

    public getMenuList(): IMenu[] {
        const allowedCodes: { code: string, permission: TPermission }[] = this.getAllowedModuleCodes().map((item) => {
            return {
                code: item.split('.')[0],
                permission: item.split('.')[1] as TPermission,
            }
        });
        const modules = Menus;
        const allowedModules: IMenu[] = []
        Object.values(modules).forEach((menu: IMenu) => {
            if (menu.children) {
                const allowedChildrens: IMenu[] = []
                Object.values(menu.children).forEach((child: IMenu) => {
                    if (allowedCodes.find(item => item.code === child.code && child.permissions?.includes(item.permission))) {
                        allowedChildrens.push(child);
                    }
                });
                menu.mappedChildren = allowedChildrens;
            }
            if (allowedCodes?.find(item => item.code === menu.code && menu.permissions?.includes(item.permission))) {
                allowedModules.push(menu)
            }
        });
        return allowedModules;
    }

    public getAllowedModuleCodes(): string[] {
        const modules = this.authSvc.getProfile()?.modules;
        return [...modules]
    }
}
