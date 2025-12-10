const request = require('supertest');
const app = require('../app');

describe('Struktura podatkov', () => {
  test('vsak zapis vsebuje obvezna polja', async () => {
    const res = await request(app).get('/api/nepremicnine');
    const items = res.body;

    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('city');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('beds');
      expect(item).toHaveProperty('baths');
      expect(item).toHaveProperty('size');
    });
  });

  test('cene so pozitivne', async () => {
    const res = await request(app).get('/api/nepremicnine');
    const items = res.body;

    items.forEach(item => {
      expect(item.price).toBeGreaterThan(0);
    });
  });

  test('city je niz', async () => {
    const res = await request(app).get('/api/nepremicnine');
    const items = res.body;

    items.forEach(item => {
      expect(typeof item.city).toBe('string');
    });
  });

  test('type je ali Stanovanje ali Hiša', async () => {
    const res = await request(app).get('/api/nepremicnine');
    const items = res.body;

    items.forEach(item => {
      expect(['Stanovanje', 'Hiša']).toContain(item.type);
    });
  });
});
