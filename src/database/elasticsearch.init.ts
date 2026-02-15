import { ElasticsearchService } from '@nestjs/elasticsearch';
import { productSearchMapping } from '@modules/mysql/products/search/product-search.mapping';
import { SearchIndex } from '@modules/mysql/products/search/search.types';

export async function initElasticsearch(
  es?: ElasticsearchService,
) {
  if (!es) return;

  try {
    const exists = await es.indices.exists({
      index: SearchIndex.PRODUCTS,
    });

    if (!exists) {
      await es.indices.create({
        index: SearchIndex.PRODUCTS,
        ...productSearchMapping,
      });
    }
  } catch (err) {
    console.error('Elasticsearch init skipped:', err.message);
  }
}
