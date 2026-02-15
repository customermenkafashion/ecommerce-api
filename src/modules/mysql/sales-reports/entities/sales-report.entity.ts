import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('sales_reports')
export class SalesReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true })
  date: string;

  @Column({ default: 0 })
  total_orders: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_sales: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_tax: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_discount: number;

  @CreateDateColumn()
  created_at: Date;
}
