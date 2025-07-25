// src/drivers/driver.controller.ts
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) { }

  @Post('add')
  @Roles(Role.Admin, Role.Staff)
  create(@Body() dto: CreateDriverDto) {
    return this.driverService.create(dto);
  }

   @Get('available')
  @Roles(Role.Admin, Role.Staff)
  getAvailableDrivers(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.driverService.getAvailableDrivers(startDate, endDate);
  }

  @Get()
  @Roles(Role.Admin, Role.Staff, Role.Viewer)
  findAll() {
    return this.driverService.findAll();
  }

  @Get('by-id/:id')
  @Roles(Role.Admin, Role.Staff, Role.Viewer)
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Staff)
  update(@Param('id') id: string, @Body() dto: UpdateDriverDto) {
    return this.driverService.update(id, dto);
  }

  @Post('assign')
  @Roles(Role.Admin, Role.Staff)
  assignDriverToTrip(@Body() dto: AssignDriverDto) {
    return this.driverService.assignToTrip(dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  removeDriver(@Param('id') id: string) {
    return this.driverService.removeDriver(id);
  }

 

}
