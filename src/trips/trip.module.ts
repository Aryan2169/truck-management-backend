import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trips.entity';
import { TripDriver } from './entities/trip-driver.entity';
import { Expense } from './entities/expense.entity';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripDriver, Expense])],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
