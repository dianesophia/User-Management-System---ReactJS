import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('UsersController (CRUD)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdUserId: string;
  const testEmail = `testuser${Date.now()}@example.com`;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Clear users table before tests
    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM users');

    // ✅ Register admin account
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin12345',
        phoneNumber: '09999999999',
        address: 'Admin Address 123',
        gender: 'male',
      })
      .expect(201);

    // ✅ Login admin to get JWT
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'admin12345' })
      .expect(200);

    jwtToken = loginRes.body.token.accessToken;
  });

  // ✅ CREATE user
  it('should create a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: 'password123',
        phoneNumber: '09123456789',
        address: '123 Test Street, City',
        gender: 'male',
        role: 'user',
      })
      .expect(201);

    createdUserId = res.body.id;
    expect(res.body.email).toBe(testEmail);
  });

  // ✅ READ all users
  it('should get all users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ READ one user by ID
  it('should get a user by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body.id).toBe(createdUserId);
  });

  // ✅ UPDATE user
  it('should update a user', async () => {
    const res = await request(app.getHttpServer())
      .put(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ firstName: 'UpdatedName' })
      .expect(200);

    expect(res.body.firstName).toBe('UpdatedName');
  });

  // ✅ DELETE user
  it('should delete a user', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
