import { BaseMapProviderId } from '../../constants/base-map-providers';
import { renderWithProviders } from '../../utils/test-utils';
import DeckglWrapper from './deckgl-wrapper';

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
  const Source = vi.fn();
  return { Map, Source };
});
vi.importMock('@belom88/vehicle-layer');

describe('Deckgl', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <DeckglWrapper
        vehicles={[]}
        baseMapProviderId={BaseMapProviderId.maplibre}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
