import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  /* =========================
     CREATE USER
  ========================== */
  async create(dto: CreateUserDto) {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    dto.password = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create(dto);
    return this.usersRepo.save(user);
  }

  /* =========================
     SEARCH + PAGINATION
  ========================== */
  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    return this.usersRepo.findAll(page, limit, search);
  }

  /* =========================
     FIND ONE
  ========================== */
  async findById(id: number) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }


  async findOneByField(field: string,value: any) {
    const user = await this.usersRepo.findOneByField(field,value);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRepo.findOne( id );
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  /* =========================
     UPDATE
  ========================== */
  async update(id: number, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await this.usersRepo.update(id, dto);
    return this.findById(id);
  }

  /* =========================
     DELETE
  ========================== */
  async remove(id: number) {
    const result = await this.usersRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async incrementTokenVersion(userId: number) {
    await this.usersRepo.incrementTokenVersion(userId);
  }


}
