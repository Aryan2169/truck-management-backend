import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Trip } from './trips.entity';

@Entity('expenses')
export class Expense extends BaseEntity {
  @ManyToOne(() => Trip, (trip) => trip.expenses)
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  tripId: string;

  @Column()
  type: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ nullable: true, type: 'text' })
  remarks: string;
}
