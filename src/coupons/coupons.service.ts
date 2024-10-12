import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { findWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async findAll(pagination: PaginationOptionsDto): Promise<{
    data: Coupon[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    return findWithPagination(this.couponRepository, pagination, [
      'categories',
      'countries',
      'brands',
    ]);
  }

  async findOne(id: string) {
    return this.couponRepository.findOne({
      where: { id },
      relations: ['categories', 'countries', 'brands'],
    });
  }
}
