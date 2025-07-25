// src/trucks/truck.controller.ts
import { Controller, Post, Body, Patch, Param, Get, UseGuards, ParseIntPipe, Delete, Query } from '@nestjs/common';
import { TruckService } from './truck.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Trucks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trucks')
export class TruckController {
  constructor(private readonly truckService: TruckService) { }

  @Post('add')
  @Roles(Role.Admin, Role.Staff)
  create(@Body() dto: CreateTruckDto) {
    return this.truckService.create(dto);
  }

  @Get('find-all')
  @Roles(Role.Admin, Role.Staff, Role.Viewer)
  findAll() {
    return this.truckService.findAll();
  }

  @Get('availability')
  @Roles(Role.Admin, Role.Staff, Role.Viewer)
  checkAvailability(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.truckService.trackAvailability(startDate, endDate);
  }


  @Get('by-id/:id')
  @Roles(Role.Admin, Role.Staff, Role.Viewer)
  findOne(@Param('id') id: string) {
    return this.truckService.findOne(id);
  }

  @Patch('update/:id')
  @Roles(Role.Admin, Role.Staff)
  update(@Param('id') id: string, @Body() dto: UpdateTruckDto) {
    return this.truckService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @Roles(Role.Admin)
  deactivate(@Param('id') id: string) {
    return this.truckService.deactivate(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  removeTruck(@Param('id') id: string) {
    return this.truckService.removeTruck(id);
  }

  @Patch(':id/toggle-status')
  @Roles(Role.Admin, Role.Staff)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async toggleStatus(@Param('id') id: string) {
    return this.truckService.toggleActiveStatus(id);
  }

}