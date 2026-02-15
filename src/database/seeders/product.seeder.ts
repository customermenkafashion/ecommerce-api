import { DataSource } from 'typeorm';
import { Product } from '../../modules/mysql/products/entities/product.entity';
import { ProductVariant } from '../../modules/mysql/products/entities/product-variant.entity';
import { VariantAttribute } from '../../modules/mysql/products/entities/variant-attribute.entity';
import { Inventory } from '../../modules/mysql/products/entities/inventory.entity';
import { ProductPrice } from '../../modules/mysql/products/entities/product-price.entity';

import { ProductsService } from '../../modules/mysql/products/services/products.service';

export async function ProductSeeder(
  dataSource: DataSource,
  productsService: ProductsService, // Injected

) {
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);

  const productsData = [
    { title: 'Smartphone X100', description: 'Latest smartphone' },
    { title: 'Gaming Laptop Z500', description: 'High-performance laptop' },
  ];

  for (const pdata of productsData) {

    // const product = productRepo.create({
    //   title: pdata.title,
    //   description: pdata.description,
    //   userId:pdata.userId,
    // });

    const product = await productsService.create({
      createProductDto: {
        title: pdata.title,
        description: pdata.description,
      },
      image:'https://rukminim2.flixcart.com/image/612/612/xif0q/night-dress-nighty/z/d/b/xl-night-suit-black-white-mukaraniya-original-imah9fp8fkgzcwz5.jpeg',
      userId: 1,
    });



    console.log(product);
    // var saved_product  = await productRepo.save(product);
    //  console.log(saved_product);

    const variantsData = [
      { color: 'Black', suffix: 'BLACK', discountedPrice: 479.99 },
      { color: 'White', suffix: 'WHITE', discountedPrice: null },
    ];

    for (const vdata of variantsData) {
      const variant = variantRepo.create({
        sku: `${product.title.replace(/\s/g, '-')}-${vdata.suffix}-${product.id}`,
        status: 'active',
        product,
        attributes: [
          { key: 'color', value: vdata.color },
          { key: 'size', value: '6.5 inch' },
        ],
        inventory: {
          quantity: 50,
          safetyStock: 10,
          reserved: 5
        },
        price: {
          price: 499.99,
          discountedPrice: vdata.discountedPrice ?? undefined,
          currency: 'INR',
        },
      });

      await variantRepo.save(variant);
    }
  }

  console.log('✅ Product seeding completed!');
}
