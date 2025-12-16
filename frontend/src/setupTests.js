import '@testing-library/jest-dom';
import { vi } from 'vitest';

beforeEach(() => {
  localStorage.clear();

  // backend klic v App.jsx naj vedno faila -> App pusti SEED
  global.fetch = vi.fn(() => Promise.reject(new Error('no-backend')));

  // utišaj console error iz catch bloka
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});
