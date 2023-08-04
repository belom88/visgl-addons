import { render } from '@testing-library/react';

import VehicleLayerProps from './vehicle-layer-props';

describe('VehicleLayerProps', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VehicleLayerProps
        vehicleScale={5}
        dimensionMode={'3D'}
        onScaleChange={vi.fn()}
        onDimensionModeChange={vi.fn()}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
