import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ads } from './entities/ad.entity';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import {
  ErrorResponse,
  errorResponse,
  notFound,
  paginate,
  PaginatedResponse,
  showOne,
  SuccessResponse,
} from 'src/common/utils/api-response-wrapper';
import { findWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ads)
    private adsRepository: Repository<Ads>,
  ) {}

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
}
