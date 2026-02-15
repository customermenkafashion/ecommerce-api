export default () => ({
  payment: {
    gateway: process.env.PAYMENT_GATEWAY || 'stripe',
    enabled: process.env.PAYMENT_ENABLED == 'true',
  },
});


