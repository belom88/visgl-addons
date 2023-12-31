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

vi.mock('react-map-gl/maplibre', () => {
  const Map = vi.fn();
  const Source = vi.fn();
  return { Map, Source };
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

  it('should have "Vehicle Layer" as the title', () => {
    const { getAllByText } = renderWithProviders(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const result = getAllByText(/Vehicle Layer/gi);
    expect(result).toHaveLength(2);
  });
});
