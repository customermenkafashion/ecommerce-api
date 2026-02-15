import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    const take = limit;
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { name: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: {
        roles: true,
        addresses: true,
      },
      take,
      skip,
      order: {
        created_at: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: {
        roles: true,
        addresses: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

     async findOneByField(
        field: string,
        value: any,
        ): Promise<User | null> {
        return this.repo.findOne({
            where: { [field]: value }, // ✅ dynamic column
        });
    }


    async findOne(id: number): Promise<User | null> {
        return this.repo.findOne({
           where: { id },
        });
    }


  create(data: Partial<User>) {
    return this.repo.create(data);
  }

  save(user: User) {
    return this.repo.save(user);
  }

  update(id: number, data: Partial<User>) {
    return this.repo.update(id, data);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }

  incrementTokenVersion(userId: number) {
    return this.repo.increment({ id: userId }, 'tokenVersion', 1);
  }
}
