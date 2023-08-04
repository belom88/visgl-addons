import VehicleLayerProps from './vehicle-layer-props';
import { renderWithProviders } from '../../../utils/test-utils';

describe('VehicleLayerProps', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <VehicleLayerProps
        vehicleScale={5}
        dimensionMode={'3D'}
        commonHexColor="#FFF"
        d3HexColor="#FFF"
        d2ForegroundHexColor="#FFF"
        d2BackgroundHexColor="#000"
        onScaleChange={vi.fn()}
        onDimensionModeChange={vi.fn()}
        onColorChange={vi.fn()}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
