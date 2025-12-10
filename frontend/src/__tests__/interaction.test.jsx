import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';

describe('App – interakcije (modal, fav, CRUD)', () => {
  test('odpre modal s podrobnostmi oglasa', () => {
    render(<App />);
    const detailsButton = screen.getAllByText(/Podrobno/i)[0];
    fireEvent.click(detailsButton);

    // opis prve nepremičnine vsebuje "Prenovljeno stanovanje"
    expect(screen.getByText(/Prenovljeno stanovanje/i)).toBeInTheDocument();
  });

  test('gumb Dodaj oglas odpre obrazec "Nov oglas"', () => {
    render(<App />);
    const addBtn = screen.getByText(/Dodaj oglas/i);
    fireEvent.click(addBtn);

    expect(screen.getByText(/Nov oglas/i)).toBeInTheDocument();
  });

  test('poskus dodajanja praznega oglasa sproži alert', () => {
    render(<App />);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const addBtn = screen.getByText(/Dodaj oglas/i);
    fireEvent.click(addBtn);

    const submitBtn = screen.getByRole('button', { name: 'Dodaj' });
    fireEvent.click(submitBtn);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy.mock.calls[0][0]).toMatch(/Izpolni naslov, mesto, ceno in površino/i);

    alertSpy.mockRestore();
  });

  test('priljubljeni oglas spremeni stanje ikone srca', () => {
    render(<App />);
    const favBtn = screen.getAllByTitle(/Priljubljeno/i)[0];
    const icon = favBtn.querySelector('svg');

    expect(icon).toHaveAttribute('fill', 'none');
    fireEvent.click(favBtn);
    expect(icon).toHaveAttribute('fill', 'currentColor');
  });
});
