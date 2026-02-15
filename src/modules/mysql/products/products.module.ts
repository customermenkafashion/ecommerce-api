
// products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Inventory } from './entities/inventory.entity';
import { ProductPrice } from './entities/product-price.entity';
import { VariantAttribute } from './entities/variant-attribute.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProductIndexService } from './search/product-index.service';
import { ProductSearchService } from './search/product-search.service';
import { PaginationModule } from '../../../common/pagination/pagination.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      Inventory,
      ProductPrice,
      VariantAttribute,
    ]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
        requestTimeout: 3000,
        maxRetries: 1,
        sniffOnStart: false,
      }),
    }),
    PaginationModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductIndexService,ProductSearchService,],
  exports: [ProductsService, ProductSearchService],
})
export class ProductsModule {}




