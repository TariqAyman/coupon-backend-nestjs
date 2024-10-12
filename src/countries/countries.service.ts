import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { Country } from './entities/country.entity';
import { findWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

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
}
