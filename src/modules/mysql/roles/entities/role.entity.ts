import {
Entity,
Column,
PrimaryGeneratedColumn,
ManyToMany,
CreateDateColumn,
UpdateDateColumn,
JoinTable
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';


@Entity('roles')
export class Role {
@PrimaryGeneratedColumn()
id: number;


// admin | seller | user | manager etc.
@Column({ unique: true, length: 50 })
name: string;


// Optional: human-readable description
@Column({ nullable: true })
description?: string;

@ManyToMany(() => Permission, (permission) => permission.roles, { cascade: true })
@JoinTable({ name: 'role_permissions' })
permissions: Permission[];


@ManyToMany(() => User, (user) => user.roles)
users: User[];


@CreateDateColumn()
createdAt: Date;


@UpdateDateColumn()
updatedAt: Date;
}