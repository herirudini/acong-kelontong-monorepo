import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/user/user.schema';
import * as bcrypt from 'bcrypt';
import { salts } from 'src/types/constants';
import { Role, RoleDocument } from 'src/modules/role/role.schema';
@Injectable()
export class UserSeederService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    ) { }

    async run() {
        const hashedPassword = await bcrypt.hash('master@admin.123', salts);
        const modules = [
            'cashier.view', 'cashier.create', 'cashier.edit', 'cashier.delete',
            'products.view', 'products.create', 'products.edit', 'products.delete',
            'brands.view', 'brands.create', 'brands.edit', 'brands.delete',
            'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete',
            'income.view', 'income.create', 'income.edit', 'income.delete',
            'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
            'users.view', 'users.create', 'users.edit', 'users.delete',
        ];

        let master;

        // check for existing master role
        const existingRole = await this.roleModel.findOne({ role_name: 'MASTER' });
        if (existingRole) {
            console.log('Master role already exists');
            master = existingRole;
        } else {
            const masterRole = await this.roleModel.create({
                role_name: 'MASTER',
                modules
            })
            master = masterRole;
        }

        // check for existing master user
        const existing = await this.userModel.findOne({ role: master._id });
        if (existing) {
            console.error('Master user already exists');
            return;
        }
        
        await this.userModel.create({
            first_name: 'Acong',
            last_name: 'Kelontong',
            password: hashedPassword,
            email: 'master@admin.com',
            role: master._id,
            verified: true,
        });

        console.info('🚀 Master user seeded successfully');
    }
}
