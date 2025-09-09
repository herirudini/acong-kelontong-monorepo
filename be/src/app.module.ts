import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederModule } from './database/seeder/seeder.module';
import { UserSeederService } from './database/seeder/user/user-seeder.service';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { toNumber } from './utils/helper';
import { SharedModule } from './shared/shared.module';

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
    UserModule,
    SeederModule,
    AuthModule,
    AdminModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: UserSeederService) { }

  async onModuleInit() {
    await this.seederService.run();
  }
}
