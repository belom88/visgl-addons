import InterleavedMap from './interleaved-map';
import { renderWithProviders } from '../../utils/test-utils';
import { BaseMapProviderId } from '../../constants/base-map-providers';

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

vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockReturnValue({
    on: vi.fn(),
  });
  return { Map };
});

vi.mock('react-map-gl/maplibre', () => {
  const Map = vi.fn();
  const Source = vi.fn();
  return { Map, Source };
});

describe('InterleavedMap', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <InterleavedMap
        vehicles={[]}
        baseMapProviderId={BaseMapProviderId.maplibre}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
