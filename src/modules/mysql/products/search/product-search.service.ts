import { Injectable, Optional } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchIndex, ProductSearchDocument } from './search.types';
import { SearchProductDto } from './search-product.dto';

@Injectable()
export class ProductSearchService {
  constructor(
    @Optional()
    private readonly es?: ElasticsearchService,
  ) {}

  // ✅ SEARCH PRODUCTS
  async search(dto: SearchProductDto) {
    if (!this.es) {
      return {
        total: 0,
        page: dto.page ?? 1,
        limit: dto.limit ?? 10,
        data: [],
      };
    }

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const from = (page - 1) * limit;

    const must: any[] = [];
    const filter: any[] = [];

    if (dto.keyword && dto.keyword.trim() !== '') {
      must.push({
        multi_match: {
          query: dto.keyword,
          fields: ['title^2', 'description', 'sku'],
        },
      });
    }

    if (dto.categoryId) {
      filter.push({ term: { categoryId: dto.categoryId } });
    }

    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      filter.push({
        range: {
          price: {
            gte: dto.minPrice ?? 0,
            lte: dto.maxPrice ?? Number.MAX_SAFE_INTEGER,
          },
        },
      });
    }

    try {
      const result = await this.es.search({
        index: SearchIndex.PRODUCTS,
        from,
        size: limit,
        query: {
          bool: { must, filter },
        },
      });

      const total =
        typeof result.hits.total === 'number'
          ? result.hits.total
          : result.hits.total?.value ?? 0;

      return {
        total,
        page,
        limit,
        data: result.hits.hits.map(hit => hit._source),
      };
    } catch {
      return {
        total: 0,
        page,
        limit,
        data: [],
      };
    }
  }

  // ✅ INDEX NEW PRODUCT
  async createProduct(product: ProductSearchDocument) {
    try {
      if (!this.es) return;

      await this.es.index({
        index: SearchIndex.PRODUCTS,
        id: product.id.toString(),
        document: product,
      });
      return 1;
    } catch {
      return 1;
    }  
  }

  // ✅ UPDATE EXISTING PRODUCT
  async updateProduct(product: ProductSearchDocument) {
    try{
      if (!this.es) return;

      await this.es.update({
        index: SearchIndex.PRODUCTS,
        id: product.id.toString(),
        doc: product,
      });
    } catch {
      return 1;
    }    
  }

  // ✅ DELETE PRODUCT
  async deleteProduct(productId: number) {
    try{
      if (!this.es) return;

       // try {
          await this.es.delete({
            index: SearchIndex.PRODUCTS,
            id: productId.toString(),
          });
        // } catch (err) {
        //   // 🔹 Ignore if product not found in Elasticsearch
        //   if (err?.meta?.statusCode !== 404) {
        //     throw err;
        //   }
        // }
    } catch {
      return 1;
    }  
  }
}
