import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { AdsAdminService } from './ads-admin.service';
import { AdsAdminController } from './ads-admin.controller';
import { Ads } from './entities/ad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { UploadMediaModule } from 'src/upload-media/upload-media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ads, Country]), UploadMediaModule],
  controllers: [AdsController, AdsAdminController],
  providers: [AdsService, AdsAdminService],
})
export class AdsModule {}
