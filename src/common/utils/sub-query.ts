import { Brand } from 'src/brands/entities/brand.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { SelectQueryBuilder } from 'typeorm';

export function createDislikedSubQuery(userId: string) {
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

export function createFavoriteSubQuery(userId: string) {
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

export function createLikedSubQuery(userId: string) {
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

export function createFollowedSubQuery(userId: string) {
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

export function createFollowedBrandSubQuery(userId: string) {
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
