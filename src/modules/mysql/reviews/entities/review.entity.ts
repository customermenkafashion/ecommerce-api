import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'int', default: 0 })
  rating: number;

  // 🔗 Each review belongs to a product
  @ManyToOne(() => Product, (product) => product.reviews, { eager: true })
  @JoinColumn({ name: 'product_id' }) // maps productId to DB column
  product: Product;

  @Column({ name: 'product_id' })
  productId: number;

  // 🔗 Each review belongs to a user
  @ManyToOne(() => User, (user) => user.carts, { eager: true })
  @JoinColumn({ name: 'user_id' }) // maps userId to DB column
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

