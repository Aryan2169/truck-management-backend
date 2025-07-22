// src/clients/client.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/clients.entity';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Trip } from '../trips/entities/trips.entity';
import { Expense } from '../trips/entities/expense.entity';
import { TripDriver } from '../trips/entities/trip-driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client,Trip,TripDriver,Expense])],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
