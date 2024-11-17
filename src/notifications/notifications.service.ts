import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { findWithPagination } from 'src/common/utils/pagination.util';
import { log } from 'console';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAll(
    pagination: PaginationOptionsDto,
    userId: string,
  ): Promise<{
    data: Notification[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {

    pagination.search = userId;
    pagination.searchField = 'userId';
log(pagination);
    return findWithPagination(this.notificationRepository, pagination);
  }
}
