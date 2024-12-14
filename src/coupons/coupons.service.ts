import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { findWithPagination } from 'src/common/utils/pagination.util';
import { log } from 'console';
import { UsersService } from 'src/users/users.service';
import { th } from '@faker-js/faker/.';
import { User } from 'src/users/entities/user.entity';
import {
  createDislikedSubQuery,
  createFavoriteSubQuery,
  createFollowedSubQuery,
  createLikedSubQuery,
} from 'src/common/utils/sub-query';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async findAll(
    pagination: PaginationOptionsDto,
    userId?: string,
  ): Promise<{
    data: Coupon[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    return await findWithPagination(
      this.couponRepository,
      pagination,
      ['categories', 'countries', 'brands'],
      (queryBuilder: any) => {
        if (userId) {
          queryBuilder.addSelect(
            createDislikedSubQuery(userId),
            'entity_isDisliked',
          );
          queryBuilder.addSelect(
            createFavoriteSubQuery(userId),
            'entity_isFavorite',
          );
          queryBuilder.addSelect(
            createFollowedSubQuery(userId),
            'entity_isFollowed',
          );
          queryBuilder.addSelect(createLikedSubQuery(userId), 'entity_isLiked');
        }
      },
    );
  }

  async findOne(id: string, userId?: string) {
    const queryBuilder = this.couponRepository
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.categories', 'categories')
      .leftJoinAndSelect('entity.countries', 'countries')
      .leftJoinAndSelect('entity.brands', 'brands')
      .where('entity.id = :id', { id });

    if (userId) {
      queryBuilder.addSelect(
        createDislikedSubQuery(userId),
        'entity_isDisliked',
      );
      queryBuilder.addSelect(
        createFavoriteSubQuery(userId),
        'entity_isFavorite',
      );
      queryBuilder.addSelect(
        createFollowedSubQuery(userId),
        'entity_isFollowed',
      );
      queryBuilder.addSelect(createLikedSubQuery(userId), 'entity_isLiked');
    }

    return queryBuilder.getOne();
  }
}
