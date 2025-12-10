const request = require('supertest');
const app = require('../app');

describe('Filtri na /api/nepremicnine', () => {
  test('filter po mestu Ljubljana', async () => {
    const res = await request(app).get('/api/nepremicnine').query({ city: 'Ljubljana' });
    const items = res.body;

    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      expect(item.city).toBe('Ljubljana');
    });
  });

  test('filter po tipu Hiša', async () => {
    const res = await request(app).get('/api/nepremicnine').query({ type: 'Hiša' });
    const items = res.body;

    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      expect(item.type).toBe('Hiša');
    });
  });

  test('filter po minimalni ceni >= 400000', async () => {
    const res = await request(app).get('/api/nepremicnine').query({ minPrice: '400000' });
    const items = res.body;

    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      expect(item.price).toBeGreaterThanOrEqual(400000);
    });
  });

  test('kombinacija mesta in minimalnega števila sob', async () => {
    const res = await request(app)
      .get('/api/nepremicnine')
      .query({ city: 'Ljubljana', minBeds: '3' });

    const items = res.body;
    items.forEach(item => {
      expect(item.city).toBe('Ljubljana');
      expect(item.beds).toBeGreaterThanOrEqual(3);
    });
  });
});
