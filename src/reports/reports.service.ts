// src/reports/reports.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { TripDriver } from '../trips/entities/trip-driver.entity';
import { Trip } from '../trips/entities/trips.entity';
import { Expense } from '../trips/entities/expense.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Trip) private tripRepo: Repository<Trip>,
        @InjectRepository(TripDriver) private tripDriverRepo: Repository<TripDriver>,
        @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
    ) { }

    async getDriverReport(driverId: string, startDate?: string, endDate?: string) {
        try {
            // Fetch trip-driver relations with the driver and their trips and expenses
            const tripDrivers = await this.tripDriverRepo.find({
                where: { driverId },
                relations: ['trip', 'trip.expenses'],
            });

            // Filter trips within the given date range
            const filteredTrips = tripDrivers
                .map((td) => td.trip)
                .filter((trip): trip is Trip => {
                    if (!trip) return false;
                    if (startDate && endDate) {
                        return trip.startDate >= startDate && trip.endDate <= endDate;
                    }
                    return true;
                });

            // Total revenue from all trips the driver participated in
            const totalRevenue = filteredTrips.reduce(
                (sum, trip) => sum + Number(trip.revenue ?? 0),
                0,
            );

            // Total expenses related to these trips
            const totalExpenses = filteredTrips.reduce((sum, trip) => {
                const expenseSum = trip.expenses?.reduce(
                    (eSum, e) => eSum + Number(e.amount ?? 0),
                    0,
                );
                return sum + (expenseSum || 0);
            }, 0);

            return {
                driverId,
                totalTrips: filteredTrips.length,
                totalRevenue,
                totalExpenses,
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }


    async getTruckReport(truckId: string, startDate?: string, endDate?: string) {
        try {
            const whereClause: any = { truckId };
            if (startDate && endDate) {
                whereClause.startDate = Between(startDate, endDate);
            }

            const trips = await this.tripRepo.find({ where: whereClause });

            const tripIds = trips.map(trip => trip.id);
            const totalRevenue = trips.reduce((sum, trip) => sum + Number(trip.revenue), 0);

            const expenses = await this.expenseRepo
                .createQueryBuilder('expense')
                .select('SUM(expense.amount)', 'total')
                .where('expense.tripId IN (:...tripIds)', { tripIds })
                .getRawOne();

            return {
                truckId,
                totalTrips: trips.length,
                totalRevenue,
                totalExpenses: Number(expenses.total || 0),
            };

        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getClientReport(clientId: string, startDate?: string, endDate?: string) {
        try {
            const whereClause: any = { clientId };
            if (startDate && endDate) {
                whereClause.startDate = Between(startDate, endDate);
            }

            const trips = await this.tripRepo.find({ where: whereClause });

            const totalRevenue = trips.reduce((sum, trip) => sum + Number(trip.revenue), 0);

            return {
                clientId,
                totalTrips: trips.length,
                totalRevenue,
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
