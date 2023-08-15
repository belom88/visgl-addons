import PickingInfo from './picking-info';
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

describe('PickingInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<PickingInfo />);
    expect(baseElement).toBeTruthy();
  });
});
