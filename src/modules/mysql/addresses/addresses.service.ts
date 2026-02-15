import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { User } from '../users/entities/user.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /* ---------------- CREATE ADDRESS ---------------- */
  async create(userId: number, dto: CreateAddressDto): Promise<Address> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { addresses: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If new address is default → unset previous default
    if (dto.is_default) {
      await this.addressRepository.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false },
      );
    }

    // If no address exists → make this default automatically
    const isFirstAddress = !user.addresses || user.addresses.length === 0;

    const address = this.addressRepository.create({
      ...dto,
      isDefault: dto.is_default ?? isFirstAddress,
      user,
    });

    return await this.addressRepository.save(address);
  }

  /* ---------------- GET ALL ---------------- */
  async findAll(): Promise<Address[]> {
    return await this.addressRepository.find({
      relations: { user: true },
    });
  }

  /* ---------------- GET ONE ---------------- */
  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  /* ---------------- UPDATE ---------------- */
  async update(id: number, dto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // If setting default → unset other defaults
    if (dto.is_default === true) {
      await this.addressRepository.update(
        { user: { id: address.user.id }, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(address, dto);
    return await this.addressRepository.save(address);
  }

  /* ---------------- DELETE ---------------- */
  async remove(id: number): Promise<{ message: string }> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const wasDefault = address.isDefault;
    const userId = address.user.id;

    await this.addressRepository.remove(address);

    // If default was deleted → assign new default automatically
    if (wasDefault) {
      const nextAddress = await this.addressRepository.findOne({
        where: { user: { id: userId } },
        order: { id: 'ASC' },
      });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await this.addressRepository.save(nextAddress);
      }
    }

    return { message: 'Address deleted successfully' };
  }
}
