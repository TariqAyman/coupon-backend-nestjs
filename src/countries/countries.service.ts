import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findAll(pagination: PaginationDto): Promise<{
    data: Country[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const pageNumber = Number(pagination.page);
    const limitNumber = Number(pagination.limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid page or limit value');
    }

    const [data, total] = await this.countryRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      order: { createdAt: 'DESC' },
    });

    return { data, total, pageNumber, limitNumber };
  }

  async findOne(id: string): Promise<Country | null> {
    return await this.countryRepository.findOne({ where: { id } });
  }
}
