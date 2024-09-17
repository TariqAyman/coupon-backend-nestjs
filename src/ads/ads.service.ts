import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ads } from './entities/ad.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  ErrorResponse,
  errorResponse,
  notFound,
  paginate,
  PaginatedResponse,
  showOne,
  SuccessResponse,
} from 'src/common/utils/api-response-wrapper';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ads)
    private adsRepository: Repository<Ads>,
  ) {}

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
}
