import { Injectable, Optional } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchIndex } from './search.types';

@Injectable()
export class ProductIndexService {
  constructor(
    @Optional()
    private readonly es?: ElasticsearchService,
  ) {}

  async indexProduct(product: any) {
    if (!this.es) return;

    try {
      await this.es.index({
        index: SearchIndex.PRODUCTS,
        id: product.id.toString(),
        document: product,
      });
    } catch (err) {
      console.error('ES index failed:', err.message);
    }
  }

  async deleteProduct(id: number) {
    if (!this.es) return;

    try {
      await this.es.delete({
        index: SearchIndex.PRODUCTS,
        id: id.toString(),
      });
    } catch {}
  }
}
