// src/clients/client.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/clients.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Trip } from '../trips/entities/trips.entity';
import { TripDriver } from '../trips/entities/trip-driver.entity';
import { Expense } from '../trips/entities/expense.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private readonly clientRepo: Repository<Client>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(TripDriver) private tripDriverRepo: Repository<TripDriver>,
    @InjectRepository(Expense)private expenseRepo: Repository<Expense>
  ) {}

  async create(dto: CreateClientDto) {
    try {
    const client = this.clientRepo.create(dto);
    await this.clientRepo.save(client);
    return { message: 'Client created successfully', data: client };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, dto: UpdateClientDto) {
    try {
      const client = await this.clientRepo.findOneBy({ id });
      if (!client) throw new NotFoundException('Client not found');
      const updated = Object.assign(client, dto);
      await this.clientRepo.save(updated);
      return { message: 'Client updated successfully', data: updated };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
      
    }
  }

  async findAll() {
    try {
      const clients = await this.clientRepo.find();
      return { message: 'All clients fetched', data: clients };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const client = await this.clientRepo.findOne({ where: { id } });
      if (!client) throw new NotFoundException('Client not found');
      return { message: 'Client fetched', data: client };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTripHistory(id: string) {
    try {
      const client = await this.clientRepo.findOne({
      where: { id },
      relations: ['trips'],
    });
    if (!client) throw new NotFoundException('Client not found');
    return {
      message: `Trip history for client ${client.name}`,
      data: client || [],
    };
    } catch (error) {
    throw new InternalServerErrorException(error.message);
    }
  }

  async removeClient(clientId: string) {
    try {
      // 1. Find all trips related to the client
  const trips = await this.tripRepo.find({
    where: { clientId },
    relations: ['tripDrivers', 'expenses'],
  });

  for (const trip of trips) {
    // 2. Delete related tripDrivers
    if (trip.tripDrivers?.length > 0) {
      const tripDriverIds = trip.tripDrivers.map((td) => td.id);
      await this.tripDriverRepo.delete(tripDriverIds);
    }

    // 3. Delete related expenses
    if (trip.expenses?.length > 0) {
      const expenseIds = trip.expenses.map((exp) => exp.id);
      await this.expenseRepo.delete(expenseIds);
    }

    // 4. Delete the trip
    await this.tripRepo.delete(trip.id);
  }

  // 5. Delete the client
  await this.clientRepo.delete(clientId);

  return { message: 'Client and related trips deleted successfully' };
    } catch (error) {
    throw new InternalServerErrorException(error.message);
    }
}

}
