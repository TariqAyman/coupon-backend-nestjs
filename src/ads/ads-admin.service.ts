import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ads } from './entities/ad.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AdsAdminService {
  constructor(
    @InjectRepository(Ads)
    private adsRepository: Repository<Ads>,
  ) {}

  async create(createAdDto: CreateAdDto) {
    const coupon = this.adsRepository.create(createAdDto);
    return this.adsRepository.save(coupon);
  }

  async findAll(pagination: PaginationDto): Promise<{
    data: Ads[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const pageNumber = Number(pagination.page);
    const limitNumber = Number(pagination.limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid page or limit value');
    }

    const [data, total] = await this.adsRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    return { data, total, pageNumber, limitNumber };
  }

  async findOne(id: string) {
    return this.adsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateAdDto: UpdateAdDto) {
    await this.adsRepository.update(id, updateAdDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const ads = await this.findOne(id);

    if (!ads) throw new NotFoundException(`Coupon with ID "${id}" not found`);

    return this.adsRepository.softDelete(id);
  }
}
