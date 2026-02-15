export class CreateOrderItemDto {
  orderId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
}
