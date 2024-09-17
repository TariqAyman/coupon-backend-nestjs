import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'src/common/utils/api-response-wrapper';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.locationsService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }
}
