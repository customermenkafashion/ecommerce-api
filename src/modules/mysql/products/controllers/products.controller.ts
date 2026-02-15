
import {UseGuards,ParseIntPipe, Query, Controller, Req,Res, Get, Post, Body,Put, Patch, Param, Delete, UploadedFile, UseInterceptors,BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryMulterOptions } from '../../../../common/file-upload/memory-multer-options';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { validateFile } from '../../../../common/validators/file-validator';
import { saveFileToDisk } from '../../../../common/file-upload/save-file';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('image', memoryMulterOptions),
  )
  async create(
    @Req() req: any,
    @Res() res: any,
    @UploadedFile() file?: Express.Multer.File,
    // @Body() createProductDto: CreateProductDto
  ) {

      /** 🔐 Authenticated user */
      const ausers = req.user; // { id, email, role }
      console.log(ausers);

     const errors: Record<string, string> = {};
    
        /* ---------- BODY VALIDATION ---------- */
        const dto = plainToInstance(CreateProductDto, req.body);
        const dtoErrors = await validate(dto);
    
        dtoErrors.forEach(err => {
          if (err.constraints) {
            errors[err.property] = Object.values(err.constraints)[0];
          }
        });
    
        /* ---------- FILE VALIDATION ---------- */
        const fileErrors = validateFile(file, {
          required: true,
          maxSize: 2 * 1024 * 1024,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
          fieldName: 'image',
        });
    
        if (fileErrors.length > 0) {
          errors['image'] = fileErrors[0];
        }
    
        /* ---------- COMBINED ERRORS ---------- */
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({
            statusCode: 400,
            error: 'Bad Request',
            message: errors,
          });
        }
    
        /* ---------- UPLOAD FILE ---------- */
        const filename = saveFileToDisk(file!, 'products');
        console.log("filename",filename);
        var user = this.productsService.create({
          createProductDto: dto,
          image:filename,
          userId: req.user.id,
        });

    
        return res.json({
          message: 'product registered successfully',
          user: user,
        });

  
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    // Call service and await
    const result = await this.productsService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search,
    );

    // Return total count and paginated products
    return {
      success: true,
      total: result.meta.total,       // ✅ total number of products
      totalPages: result.meta.totalPages,
      page: result.meta.page,
      limit: result.meta.limit,
      products: result.data,
    };
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }


@Put(':id')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(FileInterceptor('image', memoryMulterOptions))
async update(
  @Param('id') id: number,
  @Req() req: any,
  @Res() res: any,
  @UploadedFile() file?: Express.Multer.File,
) {
  /** 🔐 Authenticated user */
  const ausers = req.user; // { id, email, role }
  console.log(ausers);

  const oldProduct = await this.productsService.findOneByIdAndUserId(
    Number(id),
    Number(req.user.id),
  );

  if (!oldProduct) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message:'Product not found',
    });
  }

  const errors: Record<string, string> = {};

  // ---------- BODY VALIDATION ----------
  const dto = plainToInstance(CreateProductDto, req.body);
  const dtoErrors = await validate(dto);

  dtoErrors.forEach(err => {
    if (err.constraints) {
      errors[err.property] = Object.values(err.constraints)[0];
    }
  });

  // ---------- FILE VALIDATION ----------
  let filename: string | undefined;
  if (file) {
    const fileErrors = validateFile(file, {
      required: false, // optional for update
      maxSize: 2 * 1024 * 1024,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      fieldName: 'image',
    });

    if (fileErrors.length > 0) {
      errors['image'] = fileErrors[0];
    } else {

      // Delete old image if exists
      if (oldProduct.image) {
        const fs = require('fs');
        const path = require('path');
        const oldPath =  oldProduct.image;
        console.log("oldPath",oldPath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath); // ✅ delete old image
          console.log('Deleted old image:', oldProduct.image);
        }
      }

      filename = saveFileToDisk(file, 'products');
      console.log('filename', filename);
    }
  }

  // ---------- COMBINED ERRORS ----------
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: errors,
    });
  }

  // ---------- UPDATE PRODUCT ----------
  try {
    const updatedProduct = await this.productsService.update(Number(id), {
      updateProductDto: dto,
      image: filename,
      userId: req.user.id, // optional: only update if needed
    });

    return res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (err) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: err.message,
    });
  }
}


  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateProductDto: UpdateProductDto,
  // ) {
  //   console.log("idddddddddddd",id);
  //   return this.productsService.update(id, updateProductDto);
  // }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    await this.productsService.remove(id, req.user.id);

    return {
      message: 'Product deleted successfully',
    };
  }

}
