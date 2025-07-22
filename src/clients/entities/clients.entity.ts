// src/clients/entities/clients.entity.ts

import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Trip } from '../../trips/entities/trips.entity';

@Entity('clients')
export class Client extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  // ✅ This is required for `relations: ['trips']` to work
  @OneToMany(() => Trip, (trip) => trip.client)
  trips: Trip[];
}
