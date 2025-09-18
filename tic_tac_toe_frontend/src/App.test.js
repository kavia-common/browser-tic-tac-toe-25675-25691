import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
});

test('shows initial next player status', () => {
  render(<App />);
  expect(screen.getByText(/Next: X/i)).toBeInTheDocument();
});
