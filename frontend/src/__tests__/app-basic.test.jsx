import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App – osnovni render in paginacija', () => {
  test('prikaže naslov aplikacije', () => {
    render(<App />);
    expect(screen.getByText(/Nepremičnine/i)).toBeInTheDocument();
  });

  test('prikaže vsaj en oglas', () => {
    render(<App />);
    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);
  });

  test('prikaže informacijo o strani (Stran 1 / 2)', () => {
    render(<App />);
    expect(screen.getByText(/Stran 1 \/ 2/)).toBeInTheDocument();
  });

  test('paginacija preklopi na drugo stran', () => {
    render(<App />);
    const nextBtn = screen.getByText(/Naslednja →/);
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Stran 2 \/ 2/)).toBeInTheDocument();
  });
});
