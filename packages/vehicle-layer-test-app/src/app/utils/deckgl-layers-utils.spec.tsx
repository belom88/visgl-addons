import { renderVehicleLayer } from './deckgl-layers-utils';

describe('deckgl-layers-utils', () => {
  it('renderVehicleLayer', () => {
    const result = renderVehicleLayer([], 1);
    expect(result.id).toBe('transit-model-vehicle-layer');
  });
});
