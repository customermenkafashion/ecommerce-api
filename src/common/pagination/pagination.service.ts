// src/common/pagination/pagination.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaginationService {
  constructor(private readonly configService: ConfigService) {}

  paginate(page?: any, limit?: any) {
    const defaultLimit =
      this.configService.get<number>('pagination.defaultLimit') ?? 10;

    const maxLimit =
      this.configService.get<number>('pagination.maxLimit') ?? 100;

    // 🔒 sanitize page
    const parsedPage = Number(page);
    const finalPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    // 🔒 sanitize limit
    const parsedLimit = Number(limit);
    const requestedLimit = Number.isInteger(parsedLimit) && parsedLimit > 0
        ? parsedLimit
        : defaultLimit;

    const finalLimit = Math.min(requestedLimit, maxLimit);

    // console.log({
    //   page: finalPage,
    //   limit: finalLimit,
    //   skip: (finalPage - 1) * finalLimit,
    //   take: finalLimit,
    // });

    return {
      page: finalPage,
      limit: finalLimit,
      skip: (finalPage - 1) * finalLimit,
      take: finalLimit,
    };
  }
}
