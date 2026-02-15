import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductPrice } from '../entities/product-price.entity';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class PriceService {
  constructor(private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ProductPrice);
  }

  private get variantRepository() {
    return this.dataSource.getRepository(ProductVariant);
  }

  // Create a new price for a variant
  async create(data: {
    variantId: number;
    price: number;
    discountedPrice?: number | null;
    currency?: string;
    validFrom?: Date;
    validTo?: Date;
  }): Promise<ProductPrice> {
    // Fetch the variant first
    const variant = await this.variantRepository.findOne({ where: { id: data.variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    const priceEntity = this.repository.create({
      variant, // ✅ use the relation
      price: data.price,
      discountedPrice: data.discountedPrice ?? undefined,
      currency: data.currency ?? 'INR',
      validFrom: data.validFrom,
      validTo: data.validTo,
    });

    return await this.repository.save(priceEntity);
  }

  // Get price by ID
  async findOne(id: number): Promise<ProductPrice> {
    const price = await this.repository.findOne({
      where: { id },
      relations: ['variant'], // include variant
    });
    if (!price) throw new NotFoundException('Product price not found');
    return price;
  }

  // Get price by variantId
  async findByVariant(variantId: number): Promise<ProductPrice> {
    const variant = await this.variantRepository.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    const price = await this.repository.findOne({
      where: { variant }, // ✅ use relation instead of variantId
      relations: ['variant'],
    });
    if (!price) throw new NotFoundException('Price for this variant not found');
    return price;
  }

  // Update price
  async update(
    id: number,
    data: Partial<{
      price: number;
      discountedPrice: number | null;
      currency: string;
      validFrom: Date;
      validTo: Date;
    }>,
  ): Promise<ProductPrice> {
    const priceEntity = await this.findOne(id);

    if (data.price !== undefined) priceEntity.price = data.price;
    if (data.discountedPrice !== undefined) priceEntity.discountedPrice = data.discountedPrice ?? undefined;
    if (data.currency !== undefined) priceEntity.currency = data.currency;
    if (data.validFrom !== undefined) priceEntity.validFrom = data.validFrom;
    if (data.validTo !== undefined) priceEntity.validTo = data.validTo;

    return await this.repository.save(priceEntity);
  }

  // Delete price
  async remove(id: number): Promise<void> {
    const priceEntity = await this.findOne(id);
    await this.repository.remove(priceEntity);
  }

  // Get all prices
  async findAll(): Promise<ProductPrice[]> {
    return await this.repository.find({ relations: ['variant'] });
  }
}
