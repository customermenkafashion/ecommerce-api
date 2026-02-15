import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'product_prices' })
export class ProductPrice {
  @PrimaryGeneratedColumn()
  id: number;

  // Relation to ProductVariant
  @OneToOne(() => ProductVariant, (variant) => variant.price, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' }) // maps to DB column variant_id
  variant: ProductVariant;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', {
    name: 'discounted_price',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountedPrice?: number;

  @Column({ length: 3, default: 'INR' })
  currency: string;

  // Optional: validity period for the price
  @Column({ name: 'valid_from', type: 'timestamp', nullable: true })
  validFrom?: Date;

  @Column({ name: 'valid_to', type: 'timestamp', nullable: true })
  validTo?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
