// import { OrderItem } from '../entities/order-item.entity';

// export class OrderItemResource {
//   id: number;
//   productName: string;
//   variantName: string;
//   quantity: number;
//   price: number;

//   constructor(item: OrderItem) {
//     this.id = item.id;
//     this.productName = item.product?.name || '';
//     this.variantName = item.variant?.name || '';
//     this.quantity = item.quantity;
//     this.price = Number(item.price);
//   }

//   // Optional static method for array of items
//   static collection(items: OrderItem[]): OrderItemResource[] {
//     return items.map((item) => new OrderItemResource(item));
//   }
// }
