export enum SearchIndex {
  PRODUCTS = 'products',
}

export interface ProductSearchDocument {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  // sku?: string;
  // price: number;
  // categoryId?: number;
  // createdAt: string;
}
