import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { findWithPagination } from 'src/common/utils/pagination.util';
import { log } from 'console';
import { createFollowedBrandSubQuery } from 'src/common/utils/sub-query';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async findAll(
    pagination: PaginationOptionsDto,
    userId?: string,
  ): Promise<{
    data: Brand[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    return await findWithPagination(
      this.brandRepository,
      pagination,
      ['categories', 'countries'],
      (queryBuilder: any) => {
        if (userId) {
          queryBuilder.addSelect(
            createFollowedBrandSubQuery(userId),
            'entity_isFollowed',
          );
        }
      },
    );
  }

  async findOne(id: string) {
    return this.brandRepository.findOne({
      where: { id },
      relations: ['categories', 'countries'],
    });
  }
}
