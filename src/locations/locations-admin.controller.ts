import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/UserRole';
import { Roles } from 'src/common/decorators/roles.decorator';
import { LocationsAdminService } from './locations-admin.service';
import {
  paginate,
  showOne,
  success,
  successCreate,
} from 'src/common/utils/api-response-wrapper';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  BodyWithParam,
  transformToTypeTypes,
} from 'src/common/decorators/body-with-param.decorator';

@Controller('admin/locations')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class LocationsAdminController {
  constructor(private readonly locationsService: LocationsAdminService) {}

  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    const location = await this.locationsService.create(createLocationDto);
    return successCreate(location);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.locationsService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const location = await this.locationsService.findOne(id);
    return showOne(location);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @BodyWithParam({
      paramName: 'id',
      transformTo: transformToTypeTypes.STRING,
    })
    @Body()
    updateLocationDto: UpdateLocationDto,
  ) {
    const location = await this.locationsService.update(id, updateLocationDto);
    return success(location);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.locationsService.remove(id);
  }
}
