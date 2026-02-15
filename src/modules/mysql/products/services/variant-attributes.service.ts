// src/modules/products/services/variant-attributes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { VariantAttribute } from '../entities/variant-attribute.entity';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class VariantAttributesService {
  constructor(private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(VariantAttribute);
  }

  private get variantRepository() {
    return this.dataSource.getRepository(ProductVariant);
  }

  // Create a new attribute for a variant
  async create(data: {
    variantId: number; // numeric id
    key: string;
    value: string;
  }): Promise<VariantAttribute> {
    const variant = await this.variantRepository.findOne({ where: { id: data.variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    const attribute = this.repository.create({
      variant, // use the relation
      key: data.key,
      value: data.value,
    });

    return await this.repository.save(attribute);
  }

  // Get attribute by ID
  async findOne(id: number): Promise<VariantAttribute> {
    const attribute = await this.repository.findOne({
      where: { id },
      relations: ['variant'],
    });
    if (!attribute) throw new NotFoundException('Variant attribute not found');
    return attribute;
  }

  // Get all attributes (optional filter by variantId)
  async findAll(variantId?: number): Promise<VariantAttribute[]> {
    const query = this.repository.createQueryBuilder('attribute')
      .leftJoinAndSelect('attribute.variant', 'variant');

    if (variantId) {
      query.where('variant.id = :variantId', { variantId });
    }

    return await query.getMany();
  }

  // Update attribute
  async update(
    id: number,
    data: Partial<{ key: string; value: string }>,
  ): Promise<VariantAttribute> {
    const attribute = await this.findOne(id);

    if (data.key !== undefined) attribute.key = data.key;
    if (data.value !== undefined) attribute.value = data.value;

    return await this.repository.save(attribute);
  }

  // Delete attribute
  async remove(id: number): Promise<void> {
    const attribute = await this.findOne(id);
    await this.repository.remove(attribute);
  }

  // Delete all attributes of a variant
  async removeAllByVariant(variantId: number): Promise<void> {
    const variant = await this.variantRepository.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    await this.repository.delete({ variant });
  }
}
