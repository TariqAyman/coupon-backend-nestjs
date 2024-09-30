import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async findAll(pagination: PaginationDto): Promise<{
    data: Brand[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const pageNumber = Number(pagination.page);
    const limitNumber = Number(pagination.limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid page or limit value');
    }

    const [data, total] = await this.brandRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      relations: ['categories', 'countries'],
    });

    return { data, total, pageNumber, limitNumber };
  }

  async findOne(id: string) {
    return this.brandRepository.findOne({
      where: { id },
      relations: ['categories', 'countries'],
    });
  }
}
