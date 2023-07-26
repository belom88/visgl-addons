import { DimentionalMode, VehicleLayer } from '@belom88/deckgl-vehicle-layer';
import { AnimatedVehicle } from './vehicles-utils';

/**
 * Render VehicleLayer
 * @param vehicles - data array
 * @param vehicleScale - vehicle model scale through all axes
 * @param dimentionalMode - VehicleLayer dimentional mode
 * @returns VehicleLayer instance
 */
export const renderVehicleLayer = (
  vehicles: AnimatedVehicle[],
  vehicleScale: number,
  dimentionalMode: DimentionalMode
): VehicleLayer<AnimatedVehicle> => {
  return new VehicleLayer<AnimatedVehicle>({
    id: 'transit-model-vehicle-layer',
    data: vehicles,
    getPosition: (vehicle: AnimatedVehicle) => [
      vehicle.longitude,
      vehicle.latitude,
    ],
    getBearing: (vehicle: AnimatedVehicle) => vehicle.bearing,
    get2dFrontColor: [38, 166, 154],
    sizeScale: vehicleScale,
    dimentionalMode,
    updateTriggers: {
      sizeScale: [vehicleScale],
    },
  });
};
