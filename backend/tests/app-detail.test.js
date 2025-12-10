const request = require('supertest');
const app = require('../app');

describe('Podrobnosti ene nepremicnine', () => {
  test('GET /api/nepremicnine/apt-1 vrne konkreten zapis', async () => {
    const res = await request(app).get('/api/nepremicnine/apt-1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 'apt-1');
    expect(res.body).toHaveProperty('city');
  });

  test('GET /api/nepremicnine/ne-obstaja vrne 404', async () => {
    const res = await request(app).get('/api/nepremicnine/ne-obstaja');
    expect(res.statusCode).toBe(404);
  });
});
