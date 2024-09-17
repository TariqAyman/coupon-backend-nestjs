import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsAdminService } from './locations-admin.service';
import { LocationsAdminController } from './locations-admin.controller';
import { Location } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationsController, LocationsAdminController],
  providers: [LocationsService, LocationsAdminService],
})
export class LocationsModule {}
