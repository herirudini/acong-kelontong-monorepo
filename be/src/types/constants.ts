import { TModules } from './interfaces';

export const sessionDays = 7;
export const sessionMinutes = 15;
export const salts = 10
export const errCodes = {
  authGuard: 'GUARD_401'
}

export const modules: TModules[] = [
  'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete',
  'purchasing.view', 'purchasing.create', 'purchasing.edit', 'purchasing.delete',
  'cashier.view', 'cashier.create', 'cashier.edit', 'cashier.delete',
  'product.view', 'product.create', 'product.edit', 'product.delete',
  'brand.view', 'brand.create', 'brand.edit', 'brand.delete',
  'supplier.view', 'supplier.create', 'supplier.edit', 'supplier.delete',
  'income.view', 'income.create', 'income.edit', 'income.delete',
  'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
  'role.view', 'role.create', 'role.edit', 'role.delete',
  'user.view', 'user.create', 'user.edit', 'user.delete',
];

