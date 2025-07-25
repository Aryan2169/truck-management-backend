// src/trucks/truck.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Truck } from './entities/truck.entity';
import { Trip } from '../trips/entities/trips.entity';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { TripDriver } from '../trips/entities/trip-driver.entity';
import { Expense } from '../trips/entities/expense.entity';

@Injectable()
export class TruckService {
  constructor(
    @InjectRepository(Truck) private truckRepo: Repository<Truck>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(TripDriver) private tripDriverRepo: Repository<TripDriver>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>
  ) { }

  async create(dto: CreateTruckDto) {
    try {
      const truck = this.truckRepo.create(dto);
      return this.truckRepo.save(truck);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }

  async findAll() {
    try {
      return this.truckRepo.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const truck = await this.truckRepo.findOne({ where: { id } });
      console.log(truck)
      if (!truck) throw new NotFoundException('Truck not found');
      return truck;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, dto: UpdateTruckDto) {
    try {
      const truck = await this.findOne(id);
      Object.assign(truck, dto);
      return this.truckRepo.save(truck);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }

  async deactivate(id: string) {
    try {
      const truck = await this.findOne(id);
      truck.isActive = false;
      return this.truckRepo.save(truck);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }

  async trackAvailability(startDate: string, endDate: string) {
    try {
      const qb = this.truckRepo
        .createQueryBuilder('truck')
        .leftJoin('truck.trips', 'trip')
        .where('truck.isActive = true')
        .andWhere(
          new Brackets((qb) => {
            qb.where('trip.id IS NULL') // No trips assigned
              .orWhere(
                'trip.startDate > :endDate OR trip.endDate < :startDate',
                { startDate, endDate },
              );
          }),
        )
        .select(['truck.id', 'truck.numberPlate', 'truck.status', 'truck.isActive'])
        .groupBy('truck.id');

      return await qb.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  async removeTruck(truckId: string) {
    try {
      // 1. Find all trips associated with the truck
      const trips = await this.tripRepo.find({
        where: { truckId },
        relations: ['tripDrivers', 'expenses'],
      });

      for (const trip of trips) {
        // 2. Delete all trip_drivers related to the trip
        if (trip.tripDrivers && trip.tripDrivers.length > 0) {
          const tripDriverIds = trip.tripDrivers.map((td) => td.id);
          await this.tripDriverRepo.delete(tripDriverIds);
        }

        // 3. Delete all expenses related to the trip
        if (trip.expenses && trip.expenses.length > 0) {
          const expenseIds = trip.expenses.map((exp) => exp.id);
          await this.expenseRepo.delete(expenseIds);
        }

        // 4. Delete the trip itself
        await this.tripRepo.delete(trip.id);
      }

      // 5. Finally delete the truck
      await this.truckRepo.delete(truckId);

      return { message: 'Truck and its related trips deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async toggleActiveStatus(id: string) {
    const truck = await this.truckRepo.findOne({ where: { id } });
    if (!truck) {
      throw new NotFoundException('Truck not found');
    }

    truck.isActive = !truck.isActive;
    await this.truckRepo.save(truck);

    return {
      message: `Truck is now ${truck.isActive ? 'active' : 'inactive'}`,
      truck,
    };
  }



}