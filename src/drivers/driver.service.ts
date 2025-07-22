// src/drivers/driver.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/drivers.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { TripDriver } from '../trips/entities/trip-driver.entity';
import { Trip } from '../trips/entities/trips.entity';
import { AssignDriverDto } from './dto/assign-driver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private driverRepo: Repository<Driver>,

    @InjectRepository(TripDriver)
    private tripDriverRepo: Repository<TripDriver>,

    @InjectRepository(Trip)
    private tripRepo: Repository<Trip>,
  ) {}

  async create(dto: CreateDriverDto) {
    try {
    const driver = this.driverRepo.create(dto);
    return this.driverRepo.save(driver);
    } catch (error) {
    throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      return this.driverRepo.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      return this.driverRepo.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, dto: UpdateDriverDto) {
    try {
      const driver = await this.findOne(id);
      if (!driver) throw new NotFoundException('Driver not found');
      Object.assign(driver, dto);
      return this.driverRepo.save(driver);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

async assignToTrip(dto: AssignDriverDto) {
  try {
    const { driverId, tripId } = dto;

    const driver = await this.driverRepo.findOne({ where: { id: driverId } });
    const trip = await this.tripRepo.findOne({
      where: { id: tripId },
      relations: ['tripDrivers'],
    });

    if (!driver || !trip) {
      throw new NotFoundException('Driver or Trip not found');
    }

    // Check if driver already assigned to this trip
    const alreadyAssigned = await this.tripDriverRepo.findOne({
      where: { driverId, tripId },
    });

    if (alreadyAssigned) {
      throw new BadRequestException('Driver is already assigned to this trip');
    }

    // Check if this trip already has 2 drivers
    const currentDriversCount = await this.tripDriverRepo.count({
      where: { tripId },
    });

    if (currentDriversCount >= 2) {
      throw new BadRequestException('Trip already has 2 drivers assigned');
    }

    // Check for overlapping trip dates for the driver
    const driverTrips = await this.tripRepo
      .createQueryBuilder('trip')
      .innerJoin('trip.tripDrivers', 'td')
      .where('td.driverId = :driverId', { driverId })
      .andWhere('trip.id != :tripId', { tripId })
      .andWhere(
        `(:startDate, :endDate) OVERLAPS (trip.startDate, trip.endDate)`,
        {
          startDate: trip.startDate,
          endDate: trip.endDate,
        },
      )
      .getMany();

    if (driverTrips.length > 0) {
      throw new BadRequestException(
        'Driver is already assigned to another trip during this date range',
      );
    }

    // Assign driver to trip
    const tripDriver = this.tripDriverRepo.create({ driverId, tripId });
    return await this.tripDriverRepo.save(tripDriver);

  } catch (error) {
    // Re-throw known HTTP exceptions as-is
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }

    // For unknown errors
    console.error('Error assigning driver to trip:', error);
    throw new InternalServerErrorException(
      'An unexpected error occurred while assigning driver to trip',
    );
  }
}


  async removeDriver(id: string) {
    try {
      // Delete from trip_drivers first
      await this.tripDriverRepo.delete({ driverId: id });

      // Then delete driver
      await this.driverRepo.delete(id);

      return { message: 'Driver deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
}

}
