import { VehicleLayer } from './vehicle-layer';

jest.mock('@deck.gl/core', () => {
  const CompositeLayer = jest.fn();
  return { CompositeLayer };
});
jest.mock('@deck.gl/layers', () => {
  const IconLayer = jest.fn();
  const IconLayerProps = {};
  return { IconLayer, IconLayerProps };
});
jest.mock('@deck.gl/mesh-layers', () => {
  const ScenegraphLayer = jest.fn();
  const ScenegraphLayerProps = {};
  return { ScenegraphLayer, ScenegraphLayerProps };
});

describe('vehicleLayer', () => {
  it('should create VehicleLayer', () => {
    const vehicleLayer = new VehicleLayer({
      id: 'vehicle-layer',
      data: [{ longitude: -122.412004, latitude: 37.794254 }],
    });
    expect(vehicleLayer).toBeTruthy();
  });
});
