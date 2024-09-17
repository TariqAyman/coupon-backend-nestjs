import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CouponStatusAr, CouponStatusEn } from 'src/common/enums/CouponStatus';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CouponsAdminService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const couponData: DeepPartial<Coupon> = {
      ...createCouponDto,
      status: {
        en: createCouponDto.status.en as CouponStatusEn,
        ar: createCouponDto.status.ar as CouponStatusAr,
      },
    };
    const coupon = this.couponRepository.create(couponData);
    return this.couponRepository.save(coupon);
  }

  async findAll(pagination: PaginationDto): Promise<{
    data: Coupon[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const pageNumber = Number(pagination.page);
    const limitNumber = Number(pagination.limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid page or limit value');
    }

    const [data, total] = await this.couponRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    return { data, total, pageNumber, limitNumber };
  }

  async findOne(id: string) {
    return this.couponRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const updateData = {
      ...updateCouponDto,
      status: updateCouponDto.status
        ? {
            en: updateCouponDto.status.en as CouponStatusEn,
            ar: updateCouponDto.status.ar as CouponStatusAr,
          }
        : undefined,
    };

    const { id: _, ...updateFields } = updateData;

    await this.couponRepository.update(id, updateFields);
    return this.findOne(id);
  }

  async remove(id: string) {
    const coupon = await this.findOne(id);

    if (!coupon)
      throw new NotFoundException(`Coupon with ID "${id}" not found`);

    return this.couponRepository.softDelete(id);
  }
}
