// src/reports/reports.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('driver')
  @Roles(Role.Admin)
  getDriverReport(@Query('driverId') driverId: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.reportsService.getDriverReport(driverId, startDate, endDate);
  }

  @Get('truck')
  @Roles(Role.Admin)
  getTruckReport(@Query('truckId') truckId: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.reportsService.getTruckReport(truckId, startDate, endDate);
  }

  @Get('client')
  @Roles(Role.Admin)
  getClientReport(@Query('clientId') clientId: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.reportsService.getClientReport(clientId, startDate, endDate);
  }
}
