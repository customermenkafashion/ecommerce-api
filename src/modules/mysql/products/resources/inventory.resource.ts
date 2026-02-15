export class InventoryResource {
  id: number;
  quantity: number;
  reserved: number;
  safetyStock: number;

  constructor(inventory: any) {
    this.id = inventory.id;
    this.quantity = inventory.quantity;
    this.reserved = inventory.reserved;
    this.safetyStock = inventory.safetyStock;
  }
}