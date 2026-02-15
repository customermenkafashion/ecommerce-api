import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('addresses')
@Index(['user', 'isDefault'], { unique: true, where: '"is_default" = true' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })  // <-- add this
  user: User;

  @Column({ name: 'address_line_1', length: 255 })
  addressLine1: string;

  @Column({ name: 'address_line_2', length: 255, nullable: true })
  addressLine2?: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 20 })
  pincode: string;

  @Column({ length: 100 })
  country: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}

