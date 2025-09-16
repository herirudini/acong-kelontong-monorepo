import { Injectable } from '@angular/core';
import { Menus } from './types/constants/menus';
import { IMenu } from './types/interfaces/menu.interface';
import { AuthService } from './services/auth/auth-service';

@Injectable({
    providedIn: 'root'
})
export class Previleges {
    constructor(private authSvc: AuthService) { }

    public getMenuList(): IMenu[] {
        const previlege: string[] = this.getAllowedModuleCodes();
        const modules = Menus;
        const permitted: IMenu[] = []
        Object.values(modules).forEach((menu: IMenu) => {
            if (menu.children) {
                const allowedChildrens: IMenu[] = []
                Object.values(menu.children).forEach((child: IMenu) => {
                    if (previlege.find(item => child.permissions?.includes(item))) {
                        allowedChildrens.push(child);
                    }
                });
                if (allowedChildrens.length > 0) {
                    menu.mappedChildren = allowedChildrens;
                    permitted.push(menu)
                }
            } else if (previlege?.find(item => menu.permissions?.includes(item))) {
                permitted.push(menu)
            }
        });
        return permitted;
    }

    public getAllowedModuleCodes(): string[] {
        const modules = this.authSvc.getProfile()?.modules || [];
        return [...modules]
    }
}
