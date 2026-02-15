import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesReport } from './entities/sales-report.entity';
import { CreateSalesReportDto } from './dto/create-sales-report.dto';
import { UpdateSalesReportDto } from './dto/update-sales-report.dto';

@Injectable()
export class SalesReportsService {
  constructor(
    @InjectRepository(SalesReport)
    private readonly salesReportRepo: Repository<SalesReport>,
  ) {}

  // ✅ CREATE SALES REPORT
  async create(dto: CreateSalesReportDto) {
    const report = this.salesReportRepo.create(dto);
    return await this.salesReportRepo.save(report);
  }

  // ✅ GET ALL SALES REPORTS WITH OPTIONAL PAGINATION & SEARCH
  async findAll(page = 1, limit = 10, search?: string) {
    const qb = this.salesReportRepo.createQueryBuilder('sr')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere('sr.title LIKE :search OR sr.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ✅ GET SINGLE SALES REPORT
  async findOne(id: number) {
    const report = await this.salesReportRepo.findOne({ where: { id } });
    if (!report) throw new NotFoundException(`Sales report #${id} not found`);
    return report;
  }

  // ✅ UPDATE SALES REPORT
  async update(id: number, dto: UpdateSalesReportDto) {
    const report = await this.findOne(id);
    Object.assign(report, dto);
    return await this.salesReportRepo.save(report);
  }

  // ✅ DELETE SALES REPORT
  async remove(id: number) {
    const result = await this.salesReportRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Sales report #${id} not found`);
    return { message: 'Sales report deleted successfully' };
  }
}
