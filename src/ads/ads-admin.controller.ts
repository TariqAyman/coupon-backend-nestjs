import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdsAdminService } from './ads-admin.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/UserRole';

@Controller('admin/ads')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class AdsAdminController {
  constructor(private readonly adsAdminService: AdsAdminService) {}

  @Post()
  create(@Body() createAdDto: CreateAdDto) {
    return this.adsAdminService.create(createAdDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.adsAdminService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsAdminService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return this.adsAdminService.update(id, updateAdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adsAdminService.remove(id);
  }
}
