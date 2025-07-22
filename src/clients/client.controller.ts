// src/clients/client.controller.ts
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('add')
  @Roles(Role.Admin, Role.Staff)
  create(@Body() dto: CreateClientDto) {
    return this.clientService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Staff)
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientService.update(id, dto);
  }

  @Get('find-all')
  @Roles(Role.Admin, Role.Staff, Role.Viewer)
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Staff, Role.Viewer)
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Get('trips/:id')
  @Roles(Role.Admin, Role.Staff, Role.Viewer)
  getTripHistory(@Param('id') id: string) {
    return this.clientService.getTripHistory(id);
  }

  @Delete('id')
  @Roles(Role.Admin)
  removeClient(@Param('id') id:string){
    return this.clientService.removeClient(id)
  }
}
