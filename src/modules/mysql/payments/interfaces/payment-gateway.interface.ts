export interface PaymentGateway {
  createPayment(
    amount: number,
    currency?: string,
    metadata?: Record<string, any>,
  ): Promise<any>;
}
