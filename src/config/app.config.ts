// src/config/app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Ecommerce API',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  url: process.env.APP_URL || 'http://localhost:3000',
  debug: process.env.APP_DEBUG === 'true',
}));
