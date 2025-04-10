// tests/routes.test.js
const request = require('supertest');
const app = require('../server'); 
const supabase = require('../src/utils/supabaseClient');

describe('User Routes', () => {
  let token;
  let userId;

  afterAll(async () => {
    if (userId) {
      await supabase.from('users').delete().eq('id', userId);
    }
  });

  test('POST /users should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'routeuser@example.com',
        password: 'routepass123',
        name: 'Route User',
        address: 'Route St',
      });

    expect(response.statusCode).toBe(201);
    userId = response.body.id;
  });

  test('POST /auth/login should authenticate user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'routeuser@example.com',
        password: 'routepass123',
      });

    expect(response.statusCode).toBe(200);
    token = response.body.token;
    expect(typeof token).toBe('string');
  });

  test('GET /users/me should return current user', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe('routeuser@example.com');
  });
});
