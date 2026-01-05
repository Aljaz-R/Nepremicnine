import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

function setValue(el, value) {
  fireEvent.change(el, { target: { value } });
}

describe('App – filtri', () => {
  test('filtrira po mestu Bled (select)', () => {
    render(<App />);

    const selects = screen.getAllByRole('combobox');
    const mestoSelect = selects[0]; // Mesto

    setValue(mestoSelect, 'Bled');

    const cards = screen.getAllByRole('article');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toMatch(/Bled/);
  });

  test('filtrira po mestu Ljubljana', () => {
    render(<App />);
    const selects = screen.getAllByRole('combobox');
    const mestoSelect = selects[0]; // 0 = "Mesto"

    setValue(mestoSelect, 'Ljubljana');

    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      expect(card.textContent).toMatch(/Ljubljana/);
    });
  });

  test('filtrira po tipu Stanovanje', () => {
    render(<App />);
    const selects = screen.getAllByRole('combobox');
    const tipSelect = selects[1]; // 1 = "Tip"

    setValue(tipSelect, 'Stanovanje');

    const cards = screen.getAllByRole('article');
    cards.forEach(card => {
      expect(card.textContent).toMatch(/Stanovanje/);
    });
  });

  test('filtrira po minimalni ceni (>= 400000)', () => {
    render(<App />);
    const [minPriceInput] = screen.getAllByRole('spinbutton'); // 0 = Cena min

    setValue(minPriceInput, '400000');

    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);
  });

  test('filtrira po minimalnem številu sob (>= 3)', () => {
    render(<App />);
    const spinbuttons = screen.getAllByRole('spinbutton');
    const minBedsInput = spinbuttons[2]; // 2 = Najmanj sob

    setValue(minBedsInput, '3');

    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      expect(card.textContent).toMatch(/🛏/);
    });
  });

  test('gumb Ponastavi resetira filtre (Stran 1 / 2)', () => {
    render(<App />);
    const selects = screen.getAllByRole('combobox');
    const mestoSelect = selects[0];

    setValue(mestoSelect, 'Ljubljana');
    const resetBtn = screen.getByText(/Ponastavi/);
    fireEvent.click(resetBtn);

    expect(screen.getByText(/Stran 1 \/ 2/)).toBeInTheDocument();
  });
});
