import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe/stripe.service';
import { RazorpayService } from './razorpay/razorpay.service';
import { CartService } from '../cart/cart.service';
import { OrdersService } from '../../mysql/orders/orders.service';
import { TransactionsRepository } from '../../mysql/transactions/transactions.repository';
import { Transaction, TransactionStatus } from '../../mysql/transactions/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemsService } from '../../mysql/order-items/order-items.service';
import { TransactionsService } from '../../mysql/transactions/transactions.service';

// import { CartRepository } from '../../mysql/cart/cart.repository';
// import { Cart }           from '../../mysql/cart/entities/cart.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private configService: ConfigService,
    private stripeService: StripeService,
    private razorpayService: RazorpayService,
    private cartService: CartService,
    private ordersService: OrdersService,
    private orderItemsService: OrderItemsService,
    private transactionsService: TransactionsService,

    

    //  @InjectRepository(Transaction)
    // private readonly transactionsRepository: Repository<Transaction>, 

    // @InjectRepository(OrderItem)
    // private readonly orderItemRepository: Repository<OrderItem>, 

    // @InjectRepository(Cart)
    // private readonly cartRepository: Repository<Cart>, 

    

  ) {}

  async createPayment(userId:number,frontend_amount:number) {
    const amount = await this.cartService.getCartTotal(userId);
    if(frontend_amount != amount ){
      const enabled = this.configService.get<boolean>('payment.enabled');
      const gateway = this.configService.get<string>('payment.gateway');

      if (!enabled) {
        throw new BadRequestException('Payments are disabled');
      }

      // ✅ Create Order -------pending------------
      const order = await this.ordersService.create({
        userId,
        createOrderDto: {
          order_number: `ORD-${Date.now()}-${userId}`,
          subtotal : amount, // subtotal
          tax: 0.00,     // tax
          discount: 0.00,
          total: amount,          // subtotal + tax - discount,
          payment_method: "stripe",
          payment_status: 'pending',
          status: 'pending',
        },
      });


  

      // 1️⃣ Get user cart with relations
      const cart = await this.cartService.findAll(userId);

      console.log("User cart:", cart);

      // 2️⃣ Map over cart items and create OrderItems using custom method
      for (const item of cart) {
        await this.orderItemsService.create(
          {
            orderId: order.id,                     
            productId: item.product.id,            
            variantId: item.variant?.id,           
            quantity: item.quantity,
            price: item.variant?.price?.price ?? 0,  
          },
          userId                                
        );
      }
    
      switch (gateway) {
       case 'stripe':
        // 1️⃣ Create Stripe payment intent
        const paymentIntent = await this.stripeService.createPayment(amount, 'USD');

        // 4. Save transaction in DB
        const transaction = await this.transactionsService.createTransaction(
          order,
          amount,
          'USD',
          'stripe',
          paymentIntent.paymentIntentId,
          JSON.stringify(paymentIntent.paymentIntent)
        );

        // 3️⃣ Return paymentIntent to frontend
        return paymentIntent;

      case 'razorpay':
        const razorpay = await this.razorpayService.createPayment(amount, 'INR');
        return razorpay;

        default:
          throw new BadRequestException('Invalid payment gateway');
      }
    }else{
      throw new BadRequestException(`Payment not initiated, because price mismatched in your cart at page (${frontend_amount}) and server (${amount})`);
    }
  }

  async retrievePaymentIntent(userId:number,paymentIntentId: string) {
    const amount = await this.cartService.getCartTotal(userId);
    const retrieve = await this.stripeService.retrieve(paymentIntentId);
    console.log("retrieve",retrieve);
    await this.transactionsService.updateTransactionStatus(paymentIntentId, TransactionStatus.SUCCEEDED);
    const cart = await this.cartService.emptyUserCart(userId);
    return  retrieve;
  }


}
