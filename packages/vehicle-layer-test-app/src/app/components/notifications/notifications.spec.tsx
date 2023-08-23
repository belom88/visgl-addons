import { renderWithProviders } from '../../utils/test-utils';
import Notifications from './notifications';

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
vi.mock('react-map-gl/maplibre', () => {
  const Map = vi.fn();
  const Source = vi.fn();
  return { Map, Source };
});

describe('Notifications', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<Notifications />);
    expect(baseElement).toBeTruthy();
  });
});
