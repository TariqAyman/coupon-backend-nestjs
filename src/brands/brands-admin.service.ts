import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BrandsAdminService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
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
    });

    return { data, total, pageNumber, limitNumber };
  }

  async findOne(id: string) {
    return this.brandRepository.findOne({ where: { id } });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    await this.brandRepository.update(id, updateBrandDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const brand = await this.findOne(id);

    if (!brand) throw new NotFoundException(`Brand with ID "${id}" not found`);

    return this.brandRepository.softDelete(id);
  }
}
