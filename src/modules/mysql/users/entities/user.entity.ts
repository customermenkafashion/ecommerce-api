import { Entity, PrimaryGeneratedColumn, Column, OneToMany , ManyToMany, JoinTable} from 'typeorm';
import { Product } from '../../products/entities/product.entity'; // adjust path
import { Role } from '../../roles/entities/role.entity';
import { Address } from '../../addresses/entities/address.entity';
import { Expose } from 'class-transformer';
import { Cart } from '../../cart/entities/cart.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin','seller','customer'], default: 'customer' })
  role: string;

   // 🔥 MUST be plural
  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  // ✅ AUTO DERIVED FIELD
  @Expose()
  get defaultAddress(): Address | null {
    if (!this.addresses || this.addresses.length === 0) return null;
    return this.addresses.find(a => a.isDefault) || null;
  }

  
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];



  @Column({ default: true })
  is_active: boolean;

  // 🔗 One user can have many products
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @Column({ default: 0 })
  tokenVersion: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
