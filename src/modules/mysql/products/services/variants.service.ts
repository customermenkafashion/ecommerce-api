// src/modules/products/services/variants.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductVariant } from '../entities/product-variant.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class VariantsService {
  constructor(private readonly dataSource: DataSource) {}

  private get variantRepo() {
    return this.dataSource.getRepository(ProductVariant);
  }

  private get productRepo() {
    return this.dataSource.getRepository(Product);
  }

  // ✅ Create a new variant
  async create(data: {
    sku: string;
    productId: number;
    status?: string;
  }): Promise<ProductVariant> {

    // 🔐 Ensure product exists
    const product = await this.productRepo.findOne({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variant = this.variantRepo.create({
      sku: data.sku,
      status: data.status ?? 'active',
      product, // ✅ relation, NOT productId
    });

    return await this.variantRepo.save(variant);
  }

  // ✅ Find a variant by ID
  async findOne(id: number): Promise<ProductVariant> {
    const variant = await this.variantRepo.findOne({
      where: { id },
      relations: ['product', 'attributes', 'inventory', 'price'],
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return variant;
  }

  // ✅ Find all variants (optional filter by productId)
  async findAll(productId?: number): Promise<ProductVariant[]> {
    const query = this.variantRepo.createQueryBuilder('variant')
      .leftJoinAndSelect('variant.product', 'product');

    if (productId) {
      query.where('product.id = :productId', { productId });
    }

    return await query.getMany();
  }

  // ✅ Update a variant
  async update(
    id: number,
    data: Partial<{ sku: string; status: string }>,
  ): Promise<ProductVariant> {

    const variant = await this.findOne(id);

    if (data.sku !== undefined) variant.sku = data.sku;
    if (data.status !== undefined) variant.status = data.status;

    return await this.variantRepo.save(variant);
  }

  // ✅ Delete a variant
  async remove(id: number): Promise<void> {
    const result = await this.variantRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Variant not found');
    }
  }
}
