import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Truck } from '../../trucks/entities/truck.entity';
import { Client } from '../../clients/entities/clients.entity';
import { TripDriver } from './trip-driver.entity';
import { Expense } from './expense.entity';

@Entity('trips')
export class Trip extends BaseEntity {
  @ManyToOne(() => Truck)
  @JoinColumn({ name: 'truckId' })
  truck: Truck;

  @Column()
  truckId: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  clientId: string;

  @Column({ nullable: true })
  startLoc: string;

  @Column({ nullable: true })
  endLoc: string;

  @Column({ type: 'decimal', default: 0 })
  revenue: number;

  @OneToMany(() => TripDriver, (td) => td.trip)
  tripDrivers: TripDriver[];

  @OneToMany(() => Expense, (expense) => expense.trip)
  expenses: Expense[];

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

}
