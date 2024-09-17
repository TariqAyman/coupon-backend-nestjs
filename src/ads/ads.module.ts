import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { AdsAdminService } from './ads-admin.service';
import { AdsAdminController } from './ads-admin.controller';
import { Ads } from './entities/ad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Ads])],
  controllers: [AdsController, AdsAdminController],
  providers: [AdsService, AdsAdminService],
})
export class AdsModule {}
