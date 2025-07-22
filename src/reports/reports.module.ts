// src/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/trips/entities/trips.entity';
import { TripDriver } from 'src/trips/entities/trip-driver.entity';
import { Expense } from 'src/trips/entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripDriver, Expense])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
