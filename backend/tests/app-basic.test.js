const request = require('supertest');
const app = require('../app');

describe('Osnovni endpointi', () => {
  test('GET / vrne health-check besedilo', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Backend za nepremicnine deluje');
  });

  test('GET /api/nepremicnine vrne array nepremicnin', async () => {
    const res = await request(app).get('/api/nepremicnine');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
