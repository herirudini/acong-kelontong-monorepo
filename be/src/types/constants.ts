import { TModules } from './interfaces';

export const sessionDays = 7;
export const sessionMinutes = 15;
export const salts = 10
export const errCodes = {
  authGuard: 'GUARD_401'
}

export const modules: TModules[] = ['cashier.view', 'cashier.create', 'cashier.edit', 'cashier.delete',
  'products.view', 'products.create', 'products.edit', 'products.delete',
  'brands.view', 'brands.create', 'brands.edit', 'brands.delete',
  'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete',
  'income.view', 'income.create', 'income.edit', 'income.delete',
  'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
  'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
  'users.view', 'users.create', 'users.edit', 'users.delete'];

