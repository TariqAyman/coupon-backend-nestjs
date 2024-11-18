import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { findWithPagination } from 'src/common/utils/pagination.util';
import { log } from 'console';

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

    log(userId);
    return await findWithPagination(
      this.brandRepository,
      pagination,
      ['categories', 'countries'],
      (queryBuilder: any) => {
        if (userId) {
          queryBuilder.addSelect(
            this.createFollowedSubQuery(userId),
            'entity_isFollowed',
          );
        }
      },
    );
  }

  private createFollowedSubQuery(userId: string) {
    return (subQuery: SelectQueryBuilder<Brand>) => {
      return subQuery
        .select(
          'EXISTS(SELECT 1 FROM user_followed_brands ufcc WHERE ufcc.brandId = entity.id AND ufcc.userId = :userId)',
        )
        .from('user_followed_brands', 'ufcc')
        .limit(1)
        .setParameter('userId', userId);
    };
  }

  async findOne(id: string) {
    return this.brandRepository.findOne({
      where: { id },
      relations: ['categories', 'countries'],
    });
  }
}
