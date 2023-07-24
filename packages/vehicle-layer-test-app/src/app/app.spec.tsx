import { renderWithProviders } from './utils/test-utils';

import { BrowserRouter } from 'react-router-dom';

import App from './app';

vi.mock('@deck.gl/react', () => {
  const DeckGL = vi.fn();
  return { DeckGL };
});
vi.mock('react-map-gl/maplibre', () => {
  const Map = vi.fn();
  return { Map };
});
vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockReturnValue({
    on: vi.fn(),
  });
  return { Map };
});

vi.mock('@arcgis/core/Map', () => {
  const ArcGISMap = vi.fn();
  return { default: ArcGISMap };
});
vi.mock('@arcgis/core/views/SceneView', () => {
  const SceneView = vi.fn();
  return { default: SceneView };
});
vi.mock('@deck.gl/arcgis', () => {
  const DeckRenderer = vi.fn();
  const loadArcGISModules = vi
    .fn()
    .mockReturnValue(Promise.resolve({ DeckRenderer }));
  return { loadArcGISModules };
});
vi.mock('@arcgis/core/views/3d/externalRenderers', () => {
  const add = vi.fn();
  return { add };
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
