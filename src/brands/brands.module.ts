import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandsAdminController } from './brands-admin.controller';
import { BrandsAdminService } from './brands-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController, BrandsAdminController],
  providers: [BrandsService, BrandsAdminService],
})
export class BrandsModule {}
