import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/user/user.schema';
import * as bcrypt from 'bcrypt';
import { salts } from 'src/types/constants';
@Injectable()
export class UserSeederService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async run() {
        // check for existing master user
        const existing = await this.userModel.findOne({ role: 'MASTER' });
        if (existing) {
            console.error('Master user already exists');
            return;
        }
        const hashedPassword = await bcrypt.hash('master@admin.123', salts);
        const modules = [
            'dashboard.view',
            'dashboard.update',
            'dashboard.create',
            'dashboard-v1.view',
            'dashboard-v1.update',
            'dashboard-v1.create',
            'dashboard-v2.view',
            'dashboard-v3.view',
            'tables.view',
            'tables-simple.view',
            'forms.view',
            'forms-general.view',
            'admin.view', 'admin.create', 'admin.update', 'admin.delete',
            'users.view', 'users.create', 'users.update', 'users.delete',
            'cashier.view', 'cashier.create', 'cashier.update', 'cashier.delete',
            'inventory.view', 'inventory.create', 'inventory.update', 'inventory.delete',
            'products.view', 'products.create', 'products.update', 'products.delete',
            'brands.view', 'brands.create', 'brands.update', 'brands.delete',
            'suppliers.view', 'suppliers.create', 'suppliers.update', 'suppliers.delete',
            'finance.view', 'finance.create', 'finance.update', 'finance.delete',
            'income.view', 'income.create', 'income.update', 'income.delete',
            'expenses.view', 'expenses.create', 'expenses.update', 'expenses.delete',
        ];
        const masterUser = new this.userModel({
            first_name: 'Acong',
            last_name: 'Kelontong',
            password: hashedPassword,
            email: 'master@admin.com',
            role: 'MASTER',
            modules,
            verified: true,
        });

        await masterUser.save();
        console.info('🚀 Master user seeded successfully');
    }
}
