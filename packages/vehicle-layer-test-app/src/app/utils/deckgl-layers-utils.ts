import { DimensionMode, VehicleLayer } from '@belom88/deckgl-vehicle-layer';
import { AnimatedVehicle } from './vehicles-utils';

/**
 * Render VehicleLayer
 * @param vehicles - data array
 * @param vehicleScale - vehicle model scale through all axes
 * @param dimensionMode - VehicleLayer dimension mode
 * @returns VehicleLayer instance
 */
export const renderVehicleLayer = (
  vehicles: AnimatedVehicle[],
  vehicleScale: number,
  dimensionMode: DimensionMode,
  commonColor?: [number, number, number],
  foregroundColor2d?: [number, number, number],
  backgroundColor2d?: [number, number, number],
  color3D?: [number, number, number]
): VehicleLayer<AnimatedVehicle> => {
  return new VehicleLayer<AnimatedVehicle>({
    id: 'transit-model-vehicle-layer',
    data: vehicles,
    getPosition: (vehicle: AnimatedVehicle) => [
      vehicle.longitude,
      vehicle.latitude,
    ],
    getBearing: (vehicle: AnimatedVehicle) => vehicle.bearing,
    getColor: commonColor,
    get2dForegroundColor: foregroundColor2d,
    get2dBackgroundColor: backgroundColor2d,
    get3dColor: color3D,
    sizeScale: vehicleScale,
    dimensionMode,
    updateTriggers: {
      sizeScale: [vehicleScale],
    },
  });
};
