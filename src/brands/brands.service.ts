import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { findWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async findAll(pagination: PaginationOptionsDto): Promise<{
    data: Brand[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    return findWithPagination(this.brandRepository, pagination, [
      'categories',
      'countries',
    ]);
  }

  async findOne(id: string) {
    return this.brandRepository.findOne({
      where: { id },
      relations: ['categories', 'countries'],
    });
  }
}
