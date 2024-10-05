import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { In, Repository } from 'typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { UploadMediaService } from 'src/upload-media/upload-media.service';

@Injectable()
export class CategoriesAdminService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly uploadMediaService: UploadMediaService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    let countries: Country[] = [];
    if (
      createCategoryDto.countryIds &&
      createCategoryDto.countryIds.length > 0
    ) {
      countries = await this.countryRepository.findBy({
        id: In(createCategoryDto.countryIds),
      });
    }

    let category = this.categoryRepository.create({
      ...createCategoryDto,
      countries,
    });

    category.twitterImage = (
      await this.uploadMediaService.saveOneFile(
        files?.twitterImage,
        'category',
        category.id,
      )
    )?.url;

    category.ogImage = (
      await this.uploadMediaService.saveOneFile(
        files?.ogImage,
        'category',
        category.id,
      )
    )?.url;

    category.image = (
      await this.uploadMediaService.saveOneFile(
        files?.image,
        'category',
        category.id,
      )
    )?.url;

    category = await this.categoryRepository.save(category);

    return this.findOne(category.id);
  }

  async findAll(pagination: PaginationDto): Promise<{
    data: Category[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const pageNumber = Number(pagination.page);
    const limitNumber = Number(pagination.limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid page or limit value');
    }

    const [data, total] = await this.categoryRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      relations: ['countries'],
      order: { createdAt: 'DESC' },
    });

    return { data, total, pageNumber, limitNumber };
  }

  async findOne(id: string) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['countries'],
    });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    files: { [fieldName: string]: Express.Multer.File[] },
  ) {
    const category = await this.findOne(id);

    if (!category) throw new NotFoundException(`category with ID "${id}" not found`);

    category.twitterImage =
      (
        await this.uploadMediaService.saveOneFile(
          files?.twitterImage,
          'category',
          category.id,
        )
      )?.url ?? category.twitterImage;

    category.ogImage =
      (
        await this.uploadMediaService.saveOneFile(
          files?.ogImage,
          'category',
          category.id,
        )
      )?.url ?? category.ogImage;

    category.image =
      (
        await this.uploadMediaService.saveOneFile(
          files?.image,
          'category',
          category.id,
        )
      )?.url ?? category.image;

    // Update other fields
    Object.assign(category, updateCategoryDto);

    await this.categoryRepository.save(category);

    return this.findOne(id);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    if (!category)
      throw new NotFoundException(`Category with ID "${id}" not found`);

    return this.categoryRepository.softDelete(id);
  }
}
