import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { DataSource, DeepPartial, In, Repository } from 'typeorm';
import { CouponStatusAr, CouponStatusEn } from 'src/common/enums/CouponStatus';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { UploadMediaService } from 'src/upload-media/upload-media.service';
import { Country } from 'src/countries/entities/country.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { Category } from 'src/categories/entities/category.entity';
import { File } from 'buffer';
import { findWithPagination } from 'src/common/utils/pagination.util';
import { PushNotificationService } from 'src/notifications/push-notification.service';
import { NotificationDataDto } from 'src/notifications/dto/notification-data.dto';

@Injectable()
export class CouponsAdminService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly uploadMediaService: UploadMediaService,
    private readonly dataSource: DataSource,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async create(
    createCouponDto: CreateCouponDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    const couponData: DeepPartial<Coupon> = {
      ...createCouponDto,
      status: {
        en: createCouponDto.status.en as CouponStatusEn,
        ar: createCouponDto.status.ar as CouponStatusAr,
      },
    };

    let countries: Country[] = [];
    if (createCouponDto.countryIds && createCouponDto.countryIds.length > 0) {
      countries = await this.countryRepository.findBy({
        id: In(createCouponDto.countryIds),
      });
    }

    let brands: Brand[] = [];
    if (createCouponDto.brandIds && createCouponDto.brandIds.length > 0) {
      brands = await this.brandRepository.findBy({
        id: In(createCouponDto.brandIds),
      });
    }

    let categories: Category[] = [];
    if (createCouponDto.categoryIds && createCouponDto.categoryIds.length > 0) {
      categories = await this.categoryRepository.findBy({
        id: In(createCouponDto.categoryIds),
      });
    }

    let coupon = this.couponRepository.create({
      ...couponData,
      countries,
      brands,
      categories,
    });

    coupon.twitterImage = (
      await this.uploadMediaService.saveOneFile(
        files?.twitterImage,
        'coupon',
        coupon.id,
      )
    )?.url;

    coupon.ogImage = (
      await this.uploadMediaService.saveOneFile(
        files?.ogImage,
        'coupon',
        coupon.id,
      )
    )?.url;

    coupon = await this.couponRepository.save(coupon);

    this.sendNotificationToFollowedBrands(coupon);

    return this.findOne(coupon.id);
  }

  async sendNotificationToFollowedBrands(coupon: Coupon) {
    return this.dataSource.transaction(async (manager) => {
      const brandIds = coupon.brands.map((brand) => brand.id);

      const mostFollowed = await manager
        .createQueryBuilder('user_followed_brands', 'ulcc')
        .where('ulcc.brandId IN (:...brandIds)', { brandIds })
        .select('ulcc.userId as userId')
        .getRawMany();

      const mostFollowedUserIds = mostFollowed.map((item) => item.userId);

      const notificationData: NotificationDataDto = {
        title: {
          ar: 'قسيمة جديدة',
          en: 'New Coupon',
        },
        body: {
          ar: `تم اضافة قسيمة جديدة`,
          en: `New coupon added`,
        },
      };

      this.pushNotificationService.sendToGroupOfUsers(
        mostFollowedUserIds,
        notificationData,
      );
    });
  }

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
      select: ['categories'],
    });
  }

  async update(
    id: string,
    updateCouponDto: UpdateCouponDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    const coupon = await this.findOne(id);

    if (!coupon)
      throw new NotFoundException(`coupon with ID "${id}" not found`);

    const updateData = {
      ...updateCouponDto,
      status: updateCouponDto.status
        ? {
            en: updateCouponDto.status.en as CouponStatusEn,
            ar: updateCouponDto.status.ar as CouponStatusAr,
          }
        : undefined,
    };

    coupon.twitterImage =
      (
        await this.uploadMediaService.saveOneFile(
          files?.twitterImage,
          'coupon',
          coupon.id,
        )
      )?.url ?? coupon.twitterImage;

    coupon.ogImage =
      (
        await this.uploadMediaService.saveOneFile(
          files?.ogImage,
          'coupon',
          coupon.id,
        )
      )?.url ?? coupon.ogImage;

    // Update other fields
    Object.assign(coupon, updateData);

    await this.couponRepository.save(coupon);

    return this.findOne(id);
  }

  async remove(id: string) {
    const coupon = await this.findOne(id);

    if (!coupon)
      throw new NotFoundException(`Coupon with ID "${id}" not found`);

    return this.couponRepository.softDelete(id);
  }
}
