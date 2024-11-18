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

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    private readonly usersService: UsersService,
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
            this.createDislikedSubQuery(userId),
            'entity_isDisliked',
          );
          queryBuilder.addSelect(
            this.createFavoriteSubQuery(userId),
            'entity_isFavorite',
          );
          queryBuilder.addSelect(
            this.createFollowedSubQuery(userId),
            'entity_isFollowed',
          );
          queryBuilder.addSelect(
            this.createLikedSubQuery(userId),
            'entity_isLiked',
          );
        }
      },
    );
  }

  private createDislikedSubQuery(userId: string) {
    return (subQuery: SelectQueryBuilder<Coupon>) => {
      return subQuery
        .select(
          'EXISTS(SELECT 1 FROM user_disliked_coupons ulcc WHERE ulcc.couponId = entity.id AND ulcc.userId = :userId)',
        )
        .from('user_disliked_coupons', 'ufcc')
        .limit(1)
        .setParameter('userId', userId);
    };
  }

  private createFavoriteSubQuery(userId: string) {
    return (subQuery: SelectQueryBuilder<Coupon>) => {
      return subQuery
        .select(
          'EXISTS(SELECT 1 FROM user_favorite_coupons ulcc WHERE ulcc.couponId = entity.id AND ulcc.userId = :userId)',
        )
        .from('user_favorite_coupons', 'ufcc')
        .limit(1)
        .setParameter('userId', userId);
    };
  }

  private createLikedSubQuery(userId: string) {
    return (subQuery: SelectQueryBuilder<Coupon>) => {
      return subQuery
        .select(
          'EXISTS(SELECT 1 FROM user_liked_coupons ulcc WHERE ulcc.couponId = entity.id AND ulcc.userId = :userId)',
        )
        .from('user_liked_coupons', 'ufcc')
        .limit(1)
        .setParameter('userId', userId);
    };
  }

  private createFollowedSubQuery(userId: string) {
    return (subQuery: SelectQueryBuilder<Coupon>) => {
      return subQuery
        .select(
          'EXISTS(SELECT 1 FROM user_followed_coupons ufcc WHERE ufcc.couponId = entity.id AND ufcc.userId = :userId)',
        )
        .from('user_followed_coupons', 'ufcc')
        .limit(1)
        .setParameter('userId', userId);
    };
  }

  async findOne(id: string) {
    return this.couponRepository.findOne({
      where: { id },
      relations: ['categories', 'countries', 'brands'],
    });
  }
}
