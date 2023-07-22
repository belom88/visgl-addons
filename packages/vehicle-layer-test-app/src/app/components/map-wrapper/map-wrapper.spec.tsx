import MapWrapper from './map-wrapper';
import { renderWithProviders } from '../../utils/test-utils';

vi.mock('@deck.gl/react', () => {
  const DeckGL = vi.fn();
  return { DeckGL };
});
vi.mock('react-map-gl/maplibre', () => {
  const Map = vi.fn();
  return { Map };
});
vi.importMock('@belom88/deckgl-vehicle-layer');
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

describe('MapWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<MapWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
