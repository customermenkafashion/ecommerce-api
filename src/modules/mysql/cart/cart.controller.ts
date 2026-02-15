import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /* ---------- ADD TO CART ---------- */
  @Post()
  create(@CurrentUser() user, @Body() dto: CreateCartDto) {
    return this.cartService.create(user.id, dto);
  }

  /* ---------- USER CART ---------- */
  @Get()
  findAll(@Req() req) {
    return this.cartService.findAll(req.user.id);
  }

  /* ---------- REMOVE ITEM ---------- */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }

 


}
