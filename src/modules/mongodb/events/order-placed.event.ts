// src/events/order-placed.event.ts
export class OrderPlacedEvent {
  constructor(
    public readonly orderId: number,
    public readonly userId: number,
    public readonly totalAmount: number,
  ) {}
}
