import VehicleLayerProps from './vehicle-layer-props';
import { renderWithProviders } from '../../../utils/test-utils';

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

describe('VehicleLayerProps', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <VehicleLayerProps
        sizeMode={0}
        size={10}
        vehicleScale={5}
        dimensionMode={'3D'}
        commonHexColor="#FFF"
        d3HexColor="#FFF"
        d2ForegroundHexColor="#FFF"
        d2BackgroundHexColor="#000"
        onSizeModeChange={vi.fn()}
        onSizeChange={vi.fn()}
        onScaleChange={vi.fn()}
        onDimensionModeChange={vi.fn()}
        onColorChange={vi.fn()}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
