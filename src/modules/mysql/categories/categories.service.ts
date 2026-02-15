import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /* ---------------- CREATE ---------------- */
  // categories.service.ts

async create(dto: CreateCategoryDto): Promise<Category> {
  const slug = dto.slug ?? slugify(dto.name, { lower: true });

  const exists = await this.categoryRepository.findOne({
    where: { slug },
  });

  if (exists) {
    throw new BadRequestException('Category slug already exists');
  }

  // 🔥 CHANGE IS HERE
  let parent: Category | null = null;

  if (dto.parent_id) {
    parent = await this.categoryRepository.findOne({
      where: { id: dto.parent_id },
    });

    if (!parent) {
      throw new BadRequestException('Parent category not found');
    }
  }

  const category = this.categoryRepository.create({
    name: dto.name,
    slug,
    description: dto.description,
    is_active: dto.is_active ?? true,
    parent, // ✅ now matches entity type
  });

  return this.categoryRepository.save(category);
}



  /* ---------------- FIND ALL ---------------- */
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: {
        parent: true,
        children: true,
      },
      order: { created_at: 'DESC' },
    });
  }

  /* ---------------- FIND ONE ---------------- */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /* ---------------- UPDATE ---------------- */
  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.name) {
      category.name = dto.name;
      category.slug =
        dto.slug ?? slugify(dto.name, { lower: true });
    }

    if (dto.parent_id !== undefined) {
      if (dto.parent_id === id) {
        throw new BadRequestException(
          'Category cannot be its own parent',
        );
      }

      category.parent = dto.parent_id
        ? await this.categoryRepository.findOne({
            where: { id: dto.parent_id },
          })
        : null;
    }

    Object.assign(category, {
      description: dto.description,
      is_active: dto.is_active,
    });

    return await this.categoryRepository.save(category);
  }

  /* ---------------- DELETE ---------------- */
  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);

    await this.categoryRepository.remove(category);

    return { message: 'Category deleted successfully' };
  }
}
