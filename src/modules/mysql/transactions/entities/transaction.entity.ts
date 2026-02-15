// src/transactions/entities/transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  BeforeInsert
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { v4 as uuidv4 } from 'uuid'; // ✅ import UUID
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'transaction_id', length: 50, unique: true })
  transactionId: string;

  @ManyToOne(() => Order, (order) => order.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 10 })
  currency: string;

  @Column({ length: 50 })
  gateway: string; // stripe, paypal, wallet

  @Column({ name: 'payment_intent_id', length: 100, nullable: true })
  paymentIntentId: string; // Stripe PaymentIntent ID

  @Column({ name: 'payment_data',type: 'longtext', nullable: true })
  paymentData: string; // Stripe PaymentIntent ID

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // ✅ Auto-generate transactionId before insert
  @BeforeInsert()
  generateTransactionId() {
    // if (!this.transactionId) {
    //   this.transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    // }
    if (!this.transactionId) {
      const orderPart = this.order?.id ? this.order.id : 'NEW';
      this.transactionId = `TXN-${orderPart}-${uuidv4()}`;
    }
  }
}
