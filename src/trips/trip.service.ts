import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Trip } from './entities/trips.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripDriver } from './entities/trip-driver.entity';
import { Expense } from './entities/expense.entity';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(TripDriver) private tripDriverRepo: Repository<TripDriver>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
  ) { }

  // src/trips/trips.service.ts (partial)
  async create(createTripDto: CreateTripDto) {
    try {
      const {
        truckId,
        clientId,
        startDate,
        endDate,
        startLoc,
        endLoc,
        revenue,
        driverIds,
        expenses,
      } = createTripDto;

      if (driverIds.length > 2) {
        throw new BadRequestException('A maximum of 2 drivers can be assigned to a trip.');
      }

      // 🚫 Truck availability check for date range
      const truckConflict = await this.tripRepo.findOne({
        where: {
          truckId,
          startDate: LessThanOrEqual(endDate),
          endDate: MoreThanOrEqual(startDate),
        },
      });
      if (truckConflict) {
        throw new ConflictException('Truck is already assigned to another trip in this time range.');
      }

      // 🚫 Driver availability check for date range
      for (const driverId of driverIds) {
        const driverConflicts = await this.tripDriverRepo
          .createQueryBuilder('td')
          .leftJoinAndSelect('td.trip', 'trip')
          .where('td.driverId = :driverId', { driverId })
          .andWhere(
            '(trip.startDate <= :endDate AND trip.endDate >= :startDate)',
            { startDate, endDate }
          )
          .getOne();

        if (driverConflicts) {
          throw new ConflictException(`Driver ${driverId} is already assigned to another trip in this date range.`);
        }
      }

      const trip = this.tripRepo.create({
        truckId,
        clientId,
        startDate,
        endDate,
        startLoc,
        endLoc,
        revenue: revenue || 0,
      });
      const savedTrip = await this.tripRepo.save(trip);

      const tripDrivers = driverIds.map((driverId) =>
        this.tripDriverRepo.create({ driverId, tripId: savedTrip.id }),
      );
      await this.tripDriverRepo.save(tripDrivers);

      if (expenses?.length) {
        const tripExpenses = expenses.map((e) =>
          this.expenseRepo.create({ ...e, tripId: savedTrip.id }),
        );
        await this.expenseRepo.save(tripExpenses);
      }

      return savedTrip;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }



  async findAll() {
    try {
      return this.tripRepo.find({
        relations: ['truck', 'client', 'tripDrivers', 'tripDrivers.driver', 'expenses'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }

  async findOne(id: string) {
    try {
      const trip = await this.tripRepo.findOne({
        where: { id },
        relations: ['truck', 'client', 'tripDrivers', 'tripDrivers.driver', 'expenses'],
      });

      if (!trip) throw new NotFoundException('Trip not found');
      return trip;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }

  async update(id: string, updateTripDto: UpdateTripDto) {
    try {
      const {
        truckId,
        clientId,
        startDate,
        endDate,
        startLoc,
        endLoc,
        revenue,
        driverIds,
        expenses,
      } = updateTripDto;

      const trip = await this.tripRepo.findOne({ where: { id } });
      if (!trip) throw new NotFoundException('Trip not found');

      // 🚫 Truck availability check (excluding current trip)
      const truckConflict = await this.tripRepo
        .createQueryBuilder('trip')
        .where('trip.id != :id', { id })
        .andWhere('trip.truckId = :truckId', { truckId })
        .andWhere(
          '(trip.startDate <= :endDate AND trip.endDate >= :startDate)',
          { startDate, endDate }
        )
        .getOne();

      if (truckConflict) {
        throw new ConflictException('Truck is already assigned to another trip in this time range.');
      }

      // 🚫 Driver availability check (excluding current trip)
      if (updateTripDto.driverIds?.length && updateTripDto.driverIds.length > 2) {
        throw new BadRequestException('A maximum of 2 drivers can be assigned to a trip.');
      }


      if (driverIds) {
        for (const driverId of driverIds) {
          const conflict = await this.tripDriverRepo
            .createQueryBuilder('td')
            .leftJoinAndSelect('td.trip', 'trip')
            .where('td.driverId = :driverId', { driverId })
            .andWhere('td.tripId != :tripId', { tripId: id })
            .andWhere(
              '(trip.startDate <= :endDate AND trip.endDate >= :startDate)',
              { startDate, endDate }
            )
            .getOne();

          if (conflict) {
            throw new ConflictException(`Driver ${driverId} is already assigned to another trip in this time range.`);
          }
        }

        // Replace old drivers
        await this.tripDriverRepo.delete({ tripId: id });
        const newTripDrivers = driverIds.map((driverId) =>
          this.tripDriverRepo.create({ driverId, tripId: id }),
        );
        await this.tripDriverRepo.save(newTripDrivers);
      }

      // Replace expenses
      if (expenses) {
        await this.expenseRepo.delete({ tripId: id });
        const newExpenses = expenses.map((e) =>
          this.expenseRepo.create({ ...e, tripId: id }),
        );
        await this.expenseRepo.save(newExpenses);
      }

      Object.assign(trip, {
        truckId,
        clientId,
        startDate,
        endDate,
        startLoc,
        endLoc,
        revenue,
      });

      return await this.tripRepo.save(trip);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }



  async remove(id: string) {
    try {
      // Step 1: Delete all trip_drivers for this trip
      await this.tripDriverRepo.delete({ tripId: id });

      // Step 2: Delete all expenses for this trip
      await this.expenseRepo.delete({ tripId: id });

      // Step 3: Delete the trip itself
      await this.tripRepo.delete(id);

      return { message: 'Trip deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }

}
