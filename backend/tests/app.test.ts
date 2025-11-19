import request from 'supertest';
import app from '../src/app';

describe('app', () => {
  it('responds to health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('exposes available roles from shared schema', async () => {
    const response = await request(app).get('/roles');
    expect(response.status).toBe(200);
    expect(response.body.roles).toContain('editor');
  });
});

