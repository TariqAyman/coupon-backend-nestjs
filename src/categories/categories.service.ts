import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { findWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(pagination: PaginationOptionsDto): Promise<{
    data: Category[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    return findWithPagination(this.categoryRepository, pagination, [
      'countries',
    ]);
  }

  async findOne(id: string) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['countries'],
    });
  }
}
