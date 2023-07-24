import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';
import { AnimatedVehicle } from './vehicles-utils';

/**
 * Render VehicleLayer
 * @param vehicles - data array
 * @param vehicleScale - vehicle model scale through all axes
 * @returns VehicleLayer instance
 */
export const renderVehicleLayer = (
  vehicles: AnimatedVehicle[],
  vehicleScale: number
): VehicleLayer<AnimatedVehicle> => {
  return new VehicleLayer<AnimatedVehicle>({
    id: 'transit-model-vehicle-layer',
    data: vehicles,
    getPosition: (vehicle: AnimatedVehicle) => [
      vehicle.longitude,
      vehicle.latitude,
    ],
    getOrientation: (vehicle: AnimatedVehicle) => [
      0,
      -vehicle.bearing + 90,
      90,
    ],
    getScale: () => [vehicleScale, vehicleScale, vehicleScale],
    updateTriggers: {
      getScale: [vehicleScale],
    },
  });
};
