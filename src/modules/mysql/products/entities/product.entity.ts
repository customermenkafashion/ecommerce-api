import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany
} from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { ProductVariant } from './product-variant.entity';
import { User } from '../../users/entities/user.entity'; // adjust path
import { Category } from '../../categories/entities/category.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  // 🔗 Many products belong to one user
  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE', // if user deleted, delete products
  })
  @JoinColumn({ name: 'user_id' }) // foreign key column in DB
  user: User;

  @Column({ name: 'user_id', type: 'int' })
  userId: number; // actual FK column

   // ✅ REQUIRED (this fixes your error)
  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];

  // Product variants
  @OneToMany(
    () => ProductVariant,
    (variant) => variant.product,
    {
      cascade: true,
      eager: false,
    },
  )
  variants: ProductVariant[];

  // 🔗 One product can have many reviews
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];  

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
