import { VehicleLayer } from './vehicle-layer';

describe('vehicleLayer', () => {
  it('should create VehicleLayer', () => {
    const vehicleLayer = new VehicleLayer({
      id: 'vehicle-layer',
      data: [{ longitude: -122.412004, latitude: 37.794254 }],
    });
    expect(vehicleLayer).toBeTruthy();
  });
});
