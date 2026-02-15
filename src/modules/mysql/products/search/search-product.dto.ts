export class SearchProductDto {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number = 1;
  limit?: number = 10;
}
