import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartRepository extends Repository<Cart> {

   private cartRepo: Repository<Cart>;
  constructor(private dataSource: DataSource) {
    super(Cart, dataSource.createEntityManager());
  }

  async findUserCartItem(
    userId: number,
    productId: number,
    variantId: number,
  ): Promise<Cart | null> {
    return this.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
        variant: { id: variantId },
      },
      relations: ['variant', 'product', 'user'],
    });
  }

  async findUserCart(userId: number): Promise<Cart[]> {
    return this.find({
      where: { user: { id: userId } },
      relations: [
        'product',
        'variant',
        'variant.price',
        'variant.attributes',
        'variant.inventory',
      ],
    });
  }

 
    async emptyUserCart(userId: number) {
        return this.delete({
            user: { id: userId },
        });
    }


   async getCartTotal(userId: number): Promise<number> {
    console.log("Calculating cart total...");

    const cartItems = await this.find({
        where: { user: { id: userId } },
        relations: [
            'variant',          // ✅ single variant relation
            'variant.price',    // ✅ access price of variant
            'variant.inventory',// ✅ access inventory if needed
            'product',          // optional if you want product info
        ],
    });

    // console.log("cartItems", cartItems);

    let total = 0;

    for (const item of cartItems) {
      console.log("item.variant.price", item.variant);
        if (!item.variant || !item.variant.price) continue; // skip if no variant or price

        // Use discountedPrice if available, otherwise regular price
        const price = Number(item.variant.price.discountedPrice ?? item.variant.price.price);

        const quantity = Number(item.quantity);

        total += price * quantity;
    }

    return total;
}


}
