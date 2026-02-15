import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = this.permissionRepo.create(createPermissionDto);
    return await this.permissionRepo.save(permission);
  }

  async findAll() {
    return await this.permissionRepo.find({
      relations: ['roles'], // ✅ include roles
    });
  }


  async findOne(id: number) {
    const permission = await this.permissionRepo.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findOne(id);

    Object.assign(permission, updatePermissionDto);
    return await this.permissionRepo.save(permission);
  }

  async remove(id: number) {
    const permission = await this.findOne(id);
    await this.permissionRepo.remove(permission);

    return { message: 'Permission deleted successfully' };
  }
}
