import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { paginate } from 'src/common/utils/api-response-wrapper';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @Request() req: any,
    @Query() pagination: PaginationOptionsDto,
  ) {
    const { data, total, pageNumber, limitNumber } =
      await this.notificationsService.findAll(pagination, req.user.id);
    return paginate(data, total, pageNumber, limitNumber);
  }
}
