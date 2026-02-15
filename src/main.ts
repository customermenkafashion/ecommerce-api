
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

import { AppValidationPipe } from './common/pipes/validation.pipe';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { MulterExceptionFilter } from './common/filters/multer-exception.filter';

import { useContainer } from 'class-validator';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { initElasticsearch } from './database/elasticsearch.init';

import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ GLOBAL PIPE (ONLY ONE)
  app.useGlobalPipes(new AppValidationPipe());

  // ✅ GLOBAL INTERCEPTOR
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ✅ GLOBAL FILTER
  app.useGlobalFilters(new MulterExceptionFilter());

  // ✅ Important: Allow class-validator to use NestJS DI
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // ✅ CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // ✅ LOGGER (OPTIONAL)
  app.use((req, res, next) => {
    Logger.log(`Incoming Request: ${req.method} ${req.url}`);
    Logger.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
    Logger.log(`Body: ${JSON.stringify(req.body, null, 2)}`);
    next();
  });

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  

//  const esService = app.get(ElasticsearchService);
//   await initElasticsearch(esService);
const es = app.get(ElasticsearchService, { strict: false });
await initElasticsearch(es);

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
