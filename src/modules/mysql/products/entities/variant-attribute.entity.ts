import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'variant_attributes' })
export class VariantAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  // Many attributes belong to one variant
  @ManyToOne(() => ProductVariant, (variant) => variant.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' }) // maps to DB column variant_id
  variant: ProductVariant;

  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'varchar', length: 255 })
  value: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
