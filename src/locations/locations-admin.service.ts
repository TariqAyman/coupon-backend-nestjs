import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class LocationsAdminService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(createLocationDto);
    return await this.locationRepository.save(location);
  }

  async findAll(pagination: PaginationDto): Promise<{
    data: Location[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const pageNumber = Number(pagination.page);
    const limitNumber = Number(pagination.limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid page or limit value');
    }

    const [data, total] = await this.locationRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    return { data, total, pageNumber, limitNumber };
  }

  async findOne(id: string): Promise<Location | null> {
    return await this.locationRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location | null> {

    const { id: _, ...updateFields } = updateLocationDto;

    await this.locationRepository.update(id, updateFields);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.locationRepository.delete(id);
  }
}
