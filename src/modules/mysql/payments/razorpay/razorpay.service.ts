import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { PaymentGateway } from '../interfaces/payment-gateway.interface';

@Injectable()
export class RazorpayService implements PaymentGateway {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createPayment(amount: number, currency = 'INR') {
    const order = await this.razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `order_${Date.now()}`,
    });

    return {
      gateway: 'razorpay',
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    };
  }
}
