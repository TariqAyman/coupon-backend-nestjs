import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Country } from 'src/countries/entities/country.entity';
import { Category } from 'src/categories/entities/category.entity';
import { UploadMediaService } from 'src/upload-media/upload-media.service';

@Injectable()
export class BrandsAdminService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private uploadMediaService: UploadMediaService,
  ) {}

  async create(
    createBrandDto: CreateBrandDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    let countries: Country[] = [];
    if (createBrandDto.countryIds && createBrandDto.countryIds.length > 0) {
      countries = await this.countryRepository.findBy({
        id: In(createBrandDto.countryIds),
      });
    }

    let categories: Category[] = [];
    if (createBrandDto.categoryIds && createBrandDto.categoryIds.length > 0) {
      categories = await this.categoryRepository.findBy({
        id: In(createBrandDto.categoryIds),
      });
    }

    let brand = this.brandRepository.create({
      ...createBrandDto,
      categories,
      countries,
    });

    brand.twitterImage = (
      await this.uploadMediaService.saveOneFile(
        files?.twitterImage,
        'brand',
        brand.id,
      )
    )?.url;

    brand.ogImage = (
      await this.uploadMediaService.saveOneFile(
        files?.ogImage,
        'brand',
        brand.id,
      )
    )?.url;

    brand.image = (
      await this.uploadMediaService.saveOneFile(files?.image, 'brand', brand.id)
    )?.url;

    brand = await this.brandRepository.save(brand);

    return this.findOne(brand.id);
  }

  async findAll(pagination: PaginationDto): Promise<{
    data: Brand[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const pageNumber = Number(pagination.page);
    const limitNumber = Number(pagination.limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid page or limit value');
    }

    const [data, total] = await this.brandRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      relations: ['categories', 'countries'],
      order: { createdAt: 'DESC' },
    });

    return { data, total, pageNumber, limitNumber };
  }

  async findOne(id: string) {
    return this.brandRepository.findOne({
      where: { id },
      relations: ['categories', 'countries'],
    });
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    const brand = await this.findOne(id);

    if (!brand) throw new NotFoundException(`brand with ID "${id}" not found`);

    brand.twitterImage =
      (
        await this.uploadMediaService.saveOneFile(
          files?.twitterImage,
          'brand',
          brand.id,
        )
      )?.url ?? brand.twitterImage;

    brand.ogImage =
      (
        await this.uploadMediaService.saveOneFile(
          files?.ogImage,
          'brand',
          brand.id,
        )
      )?.url ?? brand.ogImage;

    brand.image =
      (
        await this.uploadMediaService.saveOneFile(
          files?.image,
          'brand',
          brand.id,
        )
      )?.url ?? brand.image;

    // Update other fields
    Object.assign(brand, updateBrandDto);

    await this.brandRepository.save(brand);

    return this.findOne(id);
  }

  async remove(id: string) {
    const brand = await this.findOne(id);

    if (!brand) throw new NotFoundException(`Brand with ID "${id}" not found`);

    return this.brandRepository.softDelete(id);
  }
}
