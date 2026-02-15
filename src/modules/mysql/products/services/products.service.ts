
// src/modules/products/services/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ConfigService } from '@nestjs/config';
import { PaginationService } from '@common/pagination/pagination.service';
import { ProductSearchService } from '../search/product-search.service';
import { ProductResource } from '../resources/product.resource';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
    private readonly paginationService: PaginationService,
    private readonly productSearchService: ProductSearchService,
  ) {}

  // ✅ Create a new product
  async create({
    createProductDto,
    image,
    userId,
  }: {
    createProductDto: CreateProductDto;
    image: string;
    userId: number;
  }): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      image,
      userId,
    });

    const savedProduct = await this.productRepository.save(product);
    console.log("savedProduct",savedProduct);

    // 🔹 Index product in Elasticsearch
    await this.productSearchService.createProduct({
      id: savedProduct.id,
      user_id: savedProduct.userId,
      title: savedProduct.title,
      description: savedProduct.description,
      // sku: savedProduct.sku,
      // price: savedProduct.price,
      // categoryId: savedProduct.categoryId,
      // createdAt: savedProduct.createdAt.toISOString(),
    });

    return savedProduct;
  }

  // ✅ Pagination + Search
  async findAll(page?: number, limit?: number, search?: string) {
  const pagination = this.paginationService.paginate(page, limit);
  const take = pagination.take;
  const skip = pagination.skip;
  page = pagination.page;
  limit = pagination.limit;

  const useElastic = this.configService.get<string>('USE_ELASTIC', 'false');

  if (useElastic === 'true' && search) {
    const esResult = await this.productSearchService.search({
      keyword: search,
      page,
      limit,
    });

    const productIds = esResult.data.map((p: any) => p.id);

    if (productIds.length > 0) {
      const products = await this.productRepository.find({
        where: { id: In(productIds) },
        relations: ['variants', 'variants.price', 'variants.inventory'],
      });

      return {
        data: products,
        meta: {
          total: esResult.total,
          page,
          limit: take,
          totalPages: Math.ceil(esResult.total / take),
        },
      };
    } else {
      return {
        data: [],
        meta: { total: 0, page, limit: take, totalPages: 0 },
      };
    }
  }

  // TypeORM fallback
  const findOptions: any = {
    relations: ['variants', 'variants.price', 'variants.inventory'],
    skip,
    take,
    order: { createdAt: 'DESC' },
    where: search
      ? [
          { title: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
        ]
      : {},
  };

  const [data, total] = await this.productRepository.findAndCount(findOptions);

  return {
    data: ProductResource.collection(data),
    meta: {
      total, // ✅ total products for pagination
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
}

  // ✅ Get single product by ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variants', 'variants.price', 'variants.inventory'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }


  async findOneByIdAndUserId(id: number,userId:number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id , userId },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }


 

  // ✅ Update an existing product
  async update(
    productId: number,
    {
      updateProductDto,
      image,
      userId,
    }: {
      updateProductDto: Partial<UpdateProductDto>;
      image?: string;
      userId?: number;
    },
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Merge updates
    if (updateProductDto) Object.assign(product, updateProductDto);
    if (image !== undefined) product.image = image;
    if (userId !== undefined) product.userId = userId;

    const savedProduct = await this.productRepository.save(product);

    // 🔹 Update Elasticsearch
    await this.productSearchService.updateProduct({
      id: savedProduct.id,
      user_id: savedProduct.userId,
      title: savedProduct.title,
      description: savedProduct.description,
      // sku: savedProduct.sku,
      // price: savedProduct.price,
      // categoryId: savedProduct.categoryId,
      // createdAt: savedProduct.createdAt.toISOString(),
    });

    return savedProduct;
  }

  // ✅ Remove a product by ID
  async remove(id: number, userId: number): Promise<void> {
    const result = await this.productRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException('Product not found or you do not have permission to delete it');
    }

    // 🔹 Delete from Elasticsearch
    await this.productSearchService.deleteProduct(id);
  }
}
