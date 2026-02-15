// src/modules/products/services/inventory.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(Inventory);
  }

  private get variantRepository() {
    return this.dataSource.getRepository(ProductVariant);
  }

  // Create a new inventory record for a variant
  async create(data: {
    variantId: number;
    quantity?: number;
    reserved?: number;
    safetyStock?: number;
  }): Promise<Inventory> {
    // Fetch the variant first
    const variant = await this.variantRepository.findOne({ where: { id: data.variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    const inventory = this.repository.create({
      variant,
      quantity: data.quantity ?? 0,
      reserved: data.reserved ?? 0,
      safetyStock: data.safetyStock ?? 0,
    });

    return await this.repository.save(inventory);
  }

  // Get inventory by ID
  async findOne(id: number): Promise<Inventory> {
    const inventory = await this.repository.findOne({
      where: { id },
      relations: ['variant'], // Include variant
    });
    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }

  // Get inventory by variantId
  async findByVariant(variantId: number): Promise<Inventory> {
    const variant = await this.variantRepository.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    const inventory = await this.repository.findOne({
      where: { variant },
      relations: ['variant'],
    });
    if (!inventory) throw new NotFoundException('Inventory for this variant not found');

    return inventory;
  }

  // Update inventory
  async update(
    id: number,
    data: Partial<{
      quantity: number;
      reserved: number;
      safetyStock: number;
    }>,
  ): Promise<Inventory> {
    const inventory = await this.findOne(id);

    if (data.quantity !== undefined) inventory.quantity = data.quantity;
    if (data.reserved !== undefined) inventory.reserved = data.reserved;
    if (data.safetyStock !== undefined) inventory.safetyStock = data.safetyStock;

    return await this.repository.save(inventory);
  }

  // Delete inventory
  async remove(id: number): Promise<void> {
    const inventory = await this.findOne(id);
    await this.repository.remove(inventory);
  }

  // Get all inventories
  async findAll(): Promise<Inventory[]> {
    return await this.repository.find({ relations: ['variant'] });
  }

  // Increment/decrement stock
  async adjustStock(
    variantId: number,
    quantityChange: number,
    reservedChange: number = 0,
  ): Promise<Inventory> {
    const inventory = await this.findByVariant(variantId);

    inventory.quantity += quantityChange;
    inventory.reserved += reservedChange;

    return await this.repository.save(inventory);
  }
}
