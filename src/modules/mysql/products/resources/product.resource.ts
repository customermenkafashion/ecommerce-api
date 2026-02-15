// src/modules/products/resources/product.resource.ts
import { Product } from '../entities/product.entity';
import { VariantResource } from "./variant.resource";

export class ProductResource {
  id: number;
  title: string;
  description: string;
  image: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  variants?: VariantResource[]; // you can define a VariantResource if needed

  constructor(product: Product) {
    this.id = product.id;
    this.title = product.title;
    this.description = product.description;
    this.image = product.image;
    this.userId = product.userId;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    this.variants = product.variants ? VariantResource.collection(product.variants) : [];
  }
  // ✅ Collection helper
  static collection(products: Product[]): ProductResource[] {
    return products.map(product => new ProductResource(product));
  }
}
