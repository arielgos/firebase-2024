import { render, screen } from '@testing-library/react';
import App from './App';

test('renders page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Signed/i);
  expect(linkElement).toBeInTheDocument();
});
