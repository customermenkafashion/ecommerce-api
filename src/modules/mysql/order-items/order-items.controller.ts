import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Req,
  Query,
  Param,
} from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  // ✅ CREATE ORDER ITEM
  @Post()
  create(
    @Body() dto: CreateOrderItemDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    return this.orderItemsService.create(dto, userId);
  }

  // ✅ GET ALL ORDER ITEMS
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {

    
    return this.orderItemsService.findAll(+page, +limit, search);
  }

  // ✅ GET SINGLE ORDER ITEM
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.orderItemsService.findOneByIdAndUserId(+id, userId);
  }

  // ✅ UPDATE ORDER ITEM
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(+id, dto);
  }

  // ✅ DELETE ORDER ITEM
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.orderItemsService.remove(+id, userId);
  }
}
