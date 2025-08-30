import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/user/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeederService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) { }

    async run() {
        // check for existing master user
        const existing = await this.userModel.findOne({ role: 'MASTER' });
        if (existing) {
            console.log('✅ Master user already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('Master@123', 10);
        const masterKey = await bcrypt.hash('master-key-Master@123', 10);
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
        ];
        const masterUser = new this.userModel({
            firstName: 'Acong',
            lastName: 'Kelontong',
            password: hashedPassword,
            email: 'master@admin.com',
            role: 'MASTER',
            modules,
            masterKey,
            isEmailConfirmed: true,
        });

        await masterUser.save();
        console.log('🚀 Master user seeded successfully');
    }
}
