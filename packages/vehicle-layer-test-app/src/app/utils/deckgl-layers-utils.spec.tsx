import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';

import { renderVehicleLayer } from './deckgl-layers-utils';

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

describe('deckgl-layers-utils', () => {
  it('renderVehicleLayer', () => {
    const result = renderVehicleLayer([], 1, '3D');
    expect(result).toBeInstanceOf(VehicleLayer);
  });
});
