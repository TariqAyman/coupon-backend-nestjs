import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ads } from './entities/ad.entity';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { Country } from 'src/countries/entities/country.entity';
import { UploadMediaService } from 'src/upload-media/upload-media.service';
import { findWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class AdsAdminService {
  constructor(
    @InjectRepository(Ads)
    private readonly adsRepository: Repository<Ads>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly uploadMediaService: UploadMediaService,
  ) {}

  async create(
    createAdDto: CreateAdDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    let countries: Country[] = [];
    if (createAdDto.countryIds && createAdDto.countryIds.length > 0) {
      countries = await this.countryRepository.findBy({
        id: In(createAdDto.countryIds),
      });
    }

    let ads = this.adsRepository.create({ ...createAdDto, countries });

    ads.twitterImage = (
      await this.uploadMediaService.saveOneFile(
        files?.twitterImage,
        'ads',
        ads.id,
      )
    )?.url;

    ads.ogImage = (
      await this.uploadMediaService.saveOneFile(files?.ogImage, 'ads', ads.id)
    )?.url;

    ads.image = (
      await this.uploadMediaService.saveOneFile(files?.image, 'ads', ads.id)
    )?.url;

    ads = await this.adsRepository.save(ads);
    return this.findOne(ads.id);
  }

  async findAll(pagination: PaginationOptionsDto): Promise<{
    data: Ads[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    return findWithPagination(this.adsRepository, pagination, ['countries']);
  }

  async findOne(id: string) {
    return this.adsRepository.findOne({
      where: { id },
      relations: ['countries'],
    });
  }

  async update(
    id: string,
    updateAdDto: UpdateAdDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    const ads = await this.findOne(id);

    if (!ads) throw new NotFoundException(`Ads with ID "${id}" not found`);

    ads.twitterImage =
      (
        await this.uploadMediaService.saveOneFile(
          files?.twitterImage,
          'ads',
          ads.id,
        )
      )?.url ?? ads.twitterImage;

    ads.ogImage =
      (await this.uploadMediaService.saveOneFile(files?.ogImage, 'ads', ads.id))
        ?.url ?? ads.ogImage;

    ads.image =
      (await this.uploadMediaService.saveOneFile(files?.image, 'ads', ads.id))
        ?.url ?? ads.image;

    // Update other fields
    Object.assign(ads, updateAdDto);

    await this.adsRepository.save(ads);

    return this.findOne(id);
  }

  async remove(id: string) {
    const ads = await this.findOne(id);

    if (!ads) throw new NotFoundException(`Ads with ID "${id}" not found`);

    return this.adsRepository.softDelete(id);
  }
}
