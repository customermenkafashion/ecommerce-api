export class PriceResource {
  id: number;
  price: string;
  discountedPrice: string | null;
  currency: string;

  constructor(price: any) {
    this.id = price.id;
    this.price = price.price;
    this.discountedPrice = price.discountedPrice ? price.discountedPrice : price.price;
    this.currency = price.currency;
  }
}