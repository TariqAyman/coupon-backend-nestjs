import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ads } from './entities/ad.entity';

@Injectable()
export class AdsAdminService {
  constructor(
    @InjectRepository(Ads)
    private adsRepository: Repository<Ads>,
  ) {}

  async create(createAdDto: CreateAdDto): Promise<Ads> {
    const ad = this.adsRepository.create(createAdDto);
    return this.adsRepository.save(ad);
  }

  async findAll(
    page: number | string = 1,
    limit: number | string = 10,
  ): Promise<{ data: Ads[]; total: number }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid page or limit value');
    }

    const [data, total] = await this.adsRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Ads> {
    const ad = await this.adsRepository.findOneBy({ id });
    if (!ad) {
      throw new Error(`Ad with id ${id} not found`);
    }
    return ad;
  }
  async update(id: string, updateAdDto: UpdateAdDto): Promise<Ads> {
    await this.adsRepository.update(id, updateAdDto);
    const updatedAd = await this.adsRepository.findOneBy({ id });
    if (!updatedAd) {
      throw new Error(`Ad with id ${id} not found after update`);
    }
    return updatedAd;
  }

  async remove(id: string): Promise<void> {
    await this.adsRepository.delete(id);
  }
}
