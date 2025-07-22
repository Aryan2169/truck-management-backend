import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export type UserRole = 'admin' | 'staff' | 'viewer';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: ['admin', 'staff', 'viewer'], default: 'staff' })
  role: UserRole;
}
