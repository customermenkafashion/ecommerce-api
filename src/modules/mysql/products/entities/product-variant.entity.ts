import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Product } from './product.entity';
import { VariantAttribute } from './variant-attribute.entity';
import { Inventory } from './inventory.entity';
import { ProductPrice } from './product-price.entity';
@Entity({ name: 'product_variants' })
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' }) // ✅ important
  product: Product;

  @OneToMany(() => VariantAttribute, (attribute) => attribute.variant, {
    cascade: true,
  })
  attributes: VariantAttribute[];

  @OneToOne(() => Inventory, (inventory) => inventory.variant, {
    cascade: true,
  })
  inventory: Inventory;

  @OneToOne(() => ProductPrice, (price) => price.variant, {
    cascade: true,
  })
  price: ProductPrice;

  @Column({ default: 'active' })
  status: string;
}
