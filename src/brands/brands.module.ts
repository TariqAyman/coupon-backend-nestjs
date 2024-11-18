import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandsAdminController } from './brands-admin.controller';
import { BrandsAdminService } from './brands-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Country } from 'src/countries/entities/country.entity';
import { UploadMediaModule } from 'src/upload-media/upload-media.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, Category, Country]),
    UploadMediaModule,
    UsersModule,
  ],
  controllers: [BrandsController, BrandsAdminController],
  providers: [BrandsService, BrandsAdminService],
})
export class BrandsModule {}
