import {Get, Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@CurrentUser() user,amount:number) {
    return this.paymentsService.createPayment(user.id,amount);
  }

  @Post('confirm')
  async confirmOrder(@CurrentUser() user, @Body() body: { paymentIntentId: string }) {
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      throw new BadRequestException('PaymentIntentId required');
    }

    const paymentIntent =
      await this.paymentsService.retrievePaymentIntent(user.id,paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment not successful');
    }

    // ✅ Payment verified
    // 👉 Create order in DB here

    return {
      message: 'Order confirmed successfully',
    };
  }



   @Get()
    findAll(
      
    ) {
      console.log("wwwwwwwwwwwww....");
    }


}
