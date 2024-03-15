import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import { createServer } from '../server.js';

const requestWithSupertest = supertest(createServer());

describe('Tests for fetching attempts', () => {
  it('Should return 200 with all attempts connected to a user', async () => {
    const user = {
      email: 'user@user.user',
      password: 'Aa1!Aa1!',
    };
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    await requestWithSupertest
      .get('/attempt/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  // it('should return 200 with a specific attempt connected to attemptId', () => {

  // });
});
