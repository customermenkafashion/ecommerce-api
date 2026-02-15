import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
// import * as request from 'supertest';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { useContainer } from 'class-validator';


describe('Users E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // ✅ Global validation (VERY IMPORTANT)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // ✅ Enable DI for custom validators
    useContainer(app.select(AppModule), {
      fallbackOnErrors: true,
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * ------------------------------
   * VALIDATION TESTS
   * ------------------------------
   */

  it('POST /users → should fail when body is empty', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .expect(400);
  });

  it('POST /users → should fail when email is invalid', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .field('name', 'John')
      .field('email', 'invalid-email')
      .field('password', 'password123')
      .expect(400);
  });

  /**
   * ------------------------------
   * FILE UPLOAD TEST
   * ------------------------------
   */

  it('POST /users → should fail without profile_image', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .field('name', 'John')
      .field('email', 'john@example.com')
      .field('password', 'password123')
      .expect(400);
  });

  it('POST /users → should succeed with valid data & image', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .field('name', 'John')
      .field('email', `john${Date.now()}@example.com`)
      .field('password', 'password123')
      .attach('profile_image', Buffer.from('fake-image'), {
        filename: 'profile.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201)
      .expect(res => {
        expect(res.body.message).toBe('User registered successfully');
      });
  });

//   /**
//    * ------------------------------
//    * GET TESTS
//    * ------------------------------
//    */

  it('GET /users → should return users list', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(Array.isArray);
  });
});
