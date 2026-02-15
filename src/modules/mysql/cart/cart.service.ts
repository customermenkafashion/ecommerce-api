import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CartRepository } from './cart.repository';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /* ---------- ADD TO CART ---------- */
  async create(userId: number, dto: CreateCartDto) {
    this.emptyUserCart(userId);
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const savedItems: Cart[] = [];

    for (const productItem of dto.cart) {
      const product = await this.productRepo.findOne({
        where: { id: productItem.id },
        relations: ['variants', 'variants.inventory'],
      });

      if (!product)
        throw new NotFoundException(
          `Product ${productItem.id} not found`,
        );

      for (const variantItem of productItem.variants) {
        const variant = product.variants.find(
          (v) => v.id === variantItem.id,
        );

        if (!variant)
          throw new NotFoundException(
            `Variant ${variantItem.id} not found`,
          );

        const maxQuantity = variant.inventory?.quantity ?? 0;

        if (variantItem.quantity > maxQuantity) {
          throw new BadRequestException(
            `Only ${maxQuantity} items available for this variant`,
          );
        }

        const existingCart =
          await this.cartRepository.findUserCartItem(
            user.id,
            product.id,
            variant.id,
          );

        if (existingCart) {
          const newQty = variantItem.quantity;

          if (newQty > maxQuantity) {
            throw new BadRequestException(
              `Cannot add more than ${maxQuantity} items`,
            );
          }

          existingCart.quantity = newQty;
          const updated = await this.cartRepository.save(existingCart);
          savedItems.push(updated);
        } else {
          const newCart = this.cartRepository.create({
            user,
            product,
            variant,
            quantity: variantItem.quantity,
          });

          const saved =
            await this.cartRepository.save(newCart);
          savedItems.push(saved);
        }
      }
    }

    return savedItems;
  }

  /* ---------- GET USER CART ---------- */
  async findAll(userId: number) {
    return this.cartRepository.findUserCart(userId);
  }

  /* ---------- REMOVE ITEM ---------- */
  async remove(cartId: number) {
    await this.cartRepository.delete(cartId);
    return { message: 'Item removed from cart' };
  }

  async emptyUserCart(userId: number) {
    await this.cartRepository.emptyUserCart(userId);
    return { message: 'Item removed from cart' };
  }


  async getCartTotal(userId: number) {
    return await this.cartRepository.getCartTotal(userId);
  }

 

  


}
