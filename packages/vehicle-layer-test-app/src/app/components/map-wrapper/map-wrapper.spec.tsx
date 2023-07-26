import MapWrapper from './map-wrapper';
import { renderWithProviders } from '../../utils/test-utils';

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

vi.mock('@deck.gl/arcgis', () => {
  const DeckRenderer = vi.fn();
  const loadArcGISModules = vi.fn().mockReturnValue(
    Promise.resolve({
      DeckRenderer,
      modules: [vi.fn(), vi.fn(), { add: vi.fn() }],
    })
  );
  return { loadArcGISModules };
});

describe('MapWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<MapWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
