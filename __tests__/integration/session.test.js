const request = require('supertest');

const app = require('../../src/app');
const { User } = require('../../src/app/models');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to authenticate with valid credentials', async () => {
    const user = await User.create({
      name: 'Victor Poletti',
      email: 'victorpoletti2009@hotmail.com',
      password: '123123'
    });

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
  });

  it('should not be able to authenticate with invalid credentials', async () => {
    const user = await User.create({
      name: 'Victor Poletti',
      email: 'victorpoletti2009@hotmail.com',
      password: '123123'
    });

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: '123456' });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const user = await User.create({
      name: 'Victor Poletti',
      email: 'victorpoletti2009@hotmail.com',
      password: '123123'
    });

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: '123123' });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when authenticated', async () => {
    const user = await User.create({
      name: 'Victor Poletti',
      email: 'victorpoletti2009@hotmail.com',
      password: '123123'
    });

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes when not authenticated', async () => {
    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(401);
  });
});
