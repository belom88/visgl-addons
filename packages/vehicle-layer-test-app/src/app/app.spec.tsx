import { renderWithProviders } from './utils/test-utils';

import { BrowserRouter } from 'react-router-dom';

import App from './app';

vi.mock('./pages/home/home', () => {
  return { default: vi.fn() };
});

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = renderWithProviders(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(getByText(/VehicleLayer Testing/gi)).toBeTruthy();
  });
});
