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
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/UserRole';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CountriesAdminService } from './countries-admin.service';
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

@Controller('admin/countries')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class CountriesAdminController {
  constructor(private readonly countriesService: CountriesAdminService) {}

  @Post()
  async create(@Body() createCountryDto: CreateCountryDto) {
    const country = await this.countriesService.create(createCountryDto);
    return successCreate(country);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { data, total, pageNumber, limitNumber } =
      await this.countriesService.findAll(pagination);
    return paginate(data, total, pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const country = await this.countriesService.findOne(id);
    return showOne(country);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @BodyWithParam({
      paramName: 'id',
      transformTo: transformToTypeTypes.STRING,
    })
    @Body()
    updateCountryDto: UpdateCountryDto,
  ) {
    const country = await this.countriesService.update(id, updateCountryDto);
    return success(country);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.countriesService.remove(id);
  }
}
