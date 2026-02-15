// src/common/dto/pagination-options.dto.ts
export interface PaginationOptions {
  page: number;      // current page number
  limit: number;     // number of items per page
  search?: string;   // optional search term
  userId?: number; // optional user ID for filtering, can be string or number
  eventId?: string; // optional user ID for filtering, can be string or number
}
