import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

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
}
