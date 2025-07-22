// src/trucks/truck.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Truck } from './entities/truck.entity';
import { TruckService } from './truck.service';
import { TruckController } from './truck.controller';
import { Trip } from '../trips/entities/trips.entity';
import { Expense } from '../trips/entities/expense.entity';
import { TripDriver } from '../trips/entities/trip-driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Truck,Trip,TripDriver,Expense])],
  controllers: [TruckController],
  providers: [TruckService],
})
export class TruckModule {}
