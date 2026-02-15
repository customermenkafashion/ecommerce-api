
import { Order } from './entities/order.entity';

export class OrderResource {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  paymentStatus: string;
  items: any[];
  createdAt: Date;
  updatedAt: Date;

  constructor(order: Order) {
    this.id = order.id;
    this.orderNumber = order.order_number;
    this.status = order.status;
    this.total = Number(order.total);
    this.subtotal = Number(order.subtotal);
    this.tax = Number(order.tax);
    this.discount = Number(order.discount);
    this.paymentMethod = order.payment_method;
    this.paymentStatus = order.payment_status;
    // this.items = order.orderItems;
    this.items =
        order.orderItems?.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: Number(item.price),
            total: Number(item.total),

            product: item.product
            ? {
                id: item.product.id,
                title: item.product.title,
                image: item.product.image,
                }
            : null,

            variant: item.variant
            ? {
                id: item.variant.id,
                sku: item.variant.sku,
                status: item.variant.status,
                }
            : null,
        })) || [];

    this.createdAt = order.created_at;
    this.updatedAt = order.updated_at;
  }

  static collection(orders: Order[]): OrderResource[] {
    return orders.map((order) => new OrderResource(order));
  }
}
