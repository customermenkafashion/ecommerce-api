import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]), // ✅ REQUIRED
  ],
  providers: [PermissionsService],
  controllers: [PermissionsController],
  exports: [PermissionsService], // ✅ for seed usage
})
export class PermissionsModule {}
