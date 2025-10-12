import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederModule } from './database/seeder/seeder.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { toNumber } from './utils/helper';
import { Auth, AuthSchema } from './modules/auth/auth.schema';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { AuthGuard } from './modules/auth/auth.guard';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { User, UserSchema } from './modules/user/user.schema';
import { BrandService } from './modules/brand/brand.service';
import { BrandController } from './modules/brand/brand.controller';
import { Brand, BrandSchema } from './modules/brand/brand.schema';
import { SeederService } from './database/seeder/seeder.service';
import { BaseResponse } from './utils/base-response';
import { GlobalService } from './global/global.service';
import { RoleService } from './modules/role/role.service';
import { RoleController } from './modules/role/role.controller';
import { Role, RoleSchema } from './modules/role/role.schema';
import { ModuleGuard } from './global/module.guard';
import { SupplierService } from './modules/supplier/supplier.service';
import { SupplierController } from './modules/supplier/supplier.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes .env accessible everywhere
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: () => {
        const host = process.env.SMTP_HOST as string;
        const port = process.env.SMTP_PORT ? toNumber(process.env.SMTP_PORT) : undefined;
        const user = process.env.SMTP_USER as string;
        const pass = process.env.SMTP_PASS as string;
        return {
          transport: {
            host,
            port,
            auth: {
              user,
              pass,
            },
            ignoreTLS: true,
            secure: false,
            pool: true
          },
          defaults: {
            from: `"Acong Kelontong <No Reply>" <${process.env.SMTP_USER as string}>`,
            html: '<b>Hello</b>'
          },
          preview: true,
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }
      },
    }),
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
    SeederModule,
  ],
  controllers: [AppController, AuthController, UserController, BrandController, RoleController, SupplierController],
  providers: [AppService, AuthService, AuthGuard, ModuleGuard, UserService, BrandService, BaseResponse, GlobalService, RoleService, SupplierService]
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) { }

  async onModuleInit() {
    await this.seederService.seedAll();
  }
}
