// src/drivers/entities/driver.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { TripDriver } from '../../trips/entities/trip-driver.entity';

@Entity('drivers')
export class Driver extends BaseEntity {
  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  licenseNo: string;

  @OneToMany(() => TripDriver, (td) => td.driver)
  tripDrivers: TripDriver[];
}
