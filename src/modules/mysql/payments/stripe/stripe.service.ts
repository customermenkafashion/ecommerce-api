import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentGateway } from '../interfaces/payment-gateway.interface';

@Injectable()
export class StripeService implements PaymentGateway {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    //   apiVersion: '2023-10-16',
    });
  }

  async createPayment(amount: number, currency = 'USD') {
    const amt =  Math.round(amount * 100); // ✅ round to nearest integer
    const intent = await this.stripe.paymentIntents.create({
      amount:amt,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return {
      currency,
      amount,
      gateway: 'stripe',
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      paymentIntent:intent
    };
  }

  async retrieve(paymentIntentId: string) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  



}
