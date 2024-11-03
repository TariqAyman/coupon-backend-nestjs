import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { success } from 'src/common/utils/api-response-wrapper';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('counts')
  async getCounts() {
    const counts = await this.dashboardService.getCounts();
    return success(counts);
  }

  @Get('line-chart-months')
  async getLineChartDataMonthly() {
    const chart = await this.dashboardService.getLineChartDataPerMonth();
    return success(chart);
  }

  @Get('line-chart-days')
  async getLineChartDataDaily() {
    const chart = await this.dashboardService.getLineChartDataPerDaily();
    return success(chart);
  }
}
