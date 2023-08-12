import { renderWithProviders } from './utils/test-utils';

import { BrowserRouter } from 'react-router-dom';

import App from './app';

vi.mock('@deck.gl/core', () => {
  const CompositeLayer = vi.fn();
  return { CompositeLayer };
});
vi.mock('@deck.gl/layers', () => {
  const IconLayer = vi.fn();
  const IconLayerProps = {};
  return { IconLayer, IconLayerProps };
});
vi.mock('@deck.gl/mesh-layers', () => {
  const ScenegraphLayer = vi.fn();
  const ScenegraphLayerProps = {};
  return { ScenegraphLayer, ScenegraphLayerProps };
});

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
