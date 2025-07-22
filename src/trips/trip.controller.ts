import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('add')
  @Roles(Role.Admin, Role.Staff)
  create(@Body() dto: CreateTripDto) {
    return this.tripService.create(dto);
  }

  @Get()
  @Roles(Role.Admin, Role.Staff,Role.Viewer)
  findAll() {
    return this.tripService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Staff,Role.Viewer)
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Staff)
  update(@Param('id') id: string, @Body() dto: UpdateTripDto) {
    return this.tripService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.tripService.remove(id);
  }
}
