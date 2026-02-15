
import { InventoryResource } from "./inventory.resource";
import { PriceResource } from "./price.resource";

export class VariantResource {
  id: number;
  sku: string;
  status: string;
  inventory: InventoryResource;
  price: PriceResource;

  constructor(variant: any) {
    this.id = variant.id;
    this.sku = variant.sku;
    this.status = variant.status;
    this.inventory = new InventoryResource(variant.inventory);
    this.price = new PriceResource(variant.price);
  }

  // ✅ Collection helper
  static collection(variants: any[]): VariantResource[] {
    return variants.map(variant => new VariantResource(variant));
  }
}