export const productSearchMapping = {
  mappings: {
    properties: {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      title: { type: 'text' },
      description: { type: 'text' },
      // sku: { type: 'keyword' },
      // price: { type: 'float' },
      // categoryId: { type: 'integer' },
      // createdAt: { type: 'date' },
    },
  },
} as const;
