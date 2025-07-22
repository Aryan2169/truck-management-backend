// src/trips/entities/trip-driver.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Driver } from '../../drivers/entities/drivers.entity';
import { Trip } from './trips.entity';

@Entity('trip_drivers')
export class TripDriver extends BaseEntity {
  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column()
  driverId: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  tripId: string;
}
