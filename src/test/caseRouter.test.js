import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import { createServer } from '../server.js';

const requestWithSupertest = supertest(createServer());

describe.only('authorization-nonadmin', () => {
  it('should return 200 OK on successful login', async () => {
    const user = {
      email: 'user@user.user',
      password: 'Aa1!Aa1!',
    };
    await requestWithSupertest.post('/auth/login').send(user).expect(200);
  });
});

describe('Tests for fetching cases', () => {
  it('should return 200 OK on calling api/case', async () => {
    const user = {
      email: 'user@user.user',
      password: 'Aa1!Aa1!',
    };
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    await requestWithSupertest
      .get('/case/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBeGreaterThan(0);
      });
  });
  it('should return 200 OK on calling api/case with ID', async () => {
    const user = {
      email: 'user@user.user',
      password: 'Aa1!Aa1!',
    };
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    const caseResponse = await requestWithSupertest
      .get('/case/')
      .set('Authorization', `Bearer ${token}`);
    let responseLength = caseResponse.body.length;
    const caseId = caseResponse.body[Math.floor(Math.random() * responseLength)].id;
    await requestWithSupertest
      .get('/case')
      .set('Authorization', `Bearer ${token}`)
      .query({ caseId: caseId })
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
      });
  });
});
