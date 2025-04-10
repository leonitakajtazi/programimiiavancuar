// tests/userService.test.js
const { createUser, authenticateUser } = require('../src/services/userService');
const supabase = require('../src/utils/supabaseClient');

describe('User Service', () => {
  let createdUser;

  afterAll(async () => {
    if (createdUser) {
      await supabase.from('users').delete().eq('id', createdUser.id);
    }
  });

  test('should create a new user', async () => {
    const user = {
      email: 'test@example.com',
      password: 'test1234',
      name: 'Test User',
      address: '123 Main St',
    };

    const result = await createUser(user);
    createdUser = result;

    expect(result).toHaveProperty('id');
    expect(result.email).toBe(user.email);
  });

  test('should authenticate user and return token', async () => {
    const token = await authenticateUser('test@example.com', 'test1234');
    expect(typeof token).toBe('string');
  });
});
