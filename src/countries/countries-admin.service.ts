import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { UploadMediaService } from 'src/upload-media/upload-media.service';
import { findWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class CountriesAdminService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly uploadMediaService: UploadMediaService,
  ) {}

  async create(
    createCountryDto: CreateCountryDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ): Promise<Country> {
    const country = this.countryRepository.create(createCountryDto);

    country.twitterImage = (
      await this.uploadMediaService.saveOneFile(
        files?.twitterImage,
        'country',
        country.id,
      )
    )?.url;

    country.ogImage = (
      await this.uploadMediaService.saveOneFile(
        files?.ogImage,
        'country',
        country.id,
      )
    )?.url;

    country.image = (
      await this.uploadMediaService.saveOneFile(
        files?.image,
        'country',
        country.id,
      )
    )?.url;

    return await this.countryRepository.save(country);
  }

  async findAll(pagination: PaginationOptionsDto): Promise<{
    data: Country[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    return findWithPagination(this.countryRepository, pagination);
  }

  async findOne(id: string): Promise<Country | null> {
    return await this.countryRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ): Promise<Country | null> {
    const country = await this.findOne(id);

    if (!country)
      throw new NotFoundException(`country with ID "${id}" not found`);

    country.twitterImage =
      (
        await this.uploadMediaService.saveOneFile(
          files?.twitterImage,
          'ads',
          country.id,
        )
      )?.url ?? country.twitterImage;

    country.ogImage =
      (
        await this.uploadMediaService.saveOneFile(
          files?.ogImage,
          'country',
          country.id,
        )
      )?.url ?? country.ogImage;

    country.image =
      (
        await this.uploadMediaService.saveOneFile(
          files?.image,
          'country',
          country.id,
        )
      )?.url ?? country.image;

    // Update other fields
    Object.assign(country, updateCountryDto);

    await this.countryRepository.save(country);

    return this.findOne(id);
  }

  async remove(id: string) {
    const country = await this.findOne(id);

    if (!country) throw new NotFoundException(`Ads with ID "${id}" not found`);

    return await this.countryRepository.softDelete(id);
  }
}
