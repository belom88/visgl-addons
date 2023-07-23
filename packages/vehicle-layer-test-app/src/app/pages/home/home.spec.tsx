import { renderWithProviders } from '../../utils/test-utils';

import Home from './home';

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

describe('Home', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<Home />);
    expect(baseElement).toBeTruthy();
  });
});
