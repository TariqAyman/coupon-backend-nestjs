import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesAdminService } from './countries-admin.service';
import { CountriesAdminController } from './countries-admin.controller';
import { Country } from './entities/country.entity';
import { UploadMediaModule } from 'src/upload-media/upload-media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Country]),UploadMediaModule],
  controllers: [CountriesController, CountriesAdminController],
  providers: [CountriesService, CountriesAdminService],
})
export class CountriesModule {}
