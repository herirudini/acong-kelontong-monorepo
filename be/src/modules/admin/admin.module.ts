import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [AdminController],
  imports: [SharedModule],
  providers: [AdminService]
})
export class AdminModule {}
