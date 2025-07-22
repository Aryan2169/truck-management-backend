// src/drivers/driver.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/drivers.entity';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { TripDriver } from '../trips/entities/trip-driver.entity';
import { Trip } from '../trips/entities/trips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, TripDriver, Trip])],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
