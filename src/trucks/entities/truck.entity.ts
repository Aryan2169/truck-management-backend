import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Trip } from 'src/trips/entities/trips.entity';

@Entity('trucks')
export class Truck extends BaseEntity {
  @Column({ unique: true })
  numberPlate: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  year: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'available' }) // options: available, onTrip, maintenance
  status: string;

  @Column({ nullable: true, type: 'float' })
  capacity: number;

  @Column({ nullable: true })
  lastServicedAt: Date;

  @OneToMany(() => Trip, (trip) => trip.truck)
  trips: Trip[];
}
