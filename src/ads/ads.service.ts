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

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<Ads>> {
    const { page, limit } = pagination;
    const [data, total] = await this.adsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return paginate(data, total, page, limit);
  }

  async findOne(id: string): Promise<SuccessResponse<Ads> | ErrorResponse> {
    const ad = await this.adsRepository.findOneBy({ id });
    if (!ad) {
      return notFound('Ad not found');
    }
    return showOne(ad);
  }
}
