import { DimensionMode, VehicleLayer } from '@belom88/deckgl-vehicle-layer';
import { Vehicle } from './vehicles-utils';
import { VehicleType } from 'packages/vehicle-layer/src/types';

/**
 * Render VehicleLayer
 * @param vehicles - data array
 * @param vehicleScale - vehicle model scale through all axes
 * @param dimensionMode - VehicleLayer dimension mode
 * @returns VehicleLayer instance
 */
export const renderVehicleLayer = (
  vehicles: Vehicle[],
  vehicleScale: number,
  dimensionMode: DimensionMode,
  commonColor?: [number, number, number],
  foregroundColor2d?: [number, number, number],
  backgroundColor2d?: [number, number, number],
  color3D?: [number, number, number]
): VehicleLayer<Vehicle> => {
  return new VehicleLayer<Vehicle>({
    id: 'transit-model-vehicle-layer',
    data: vehicles,
    getPosition: (vehicle: Vehicle) => [
      vehicle.longitude,
      vehicle.latitude,
    ],
    getBearing: (vehicle: Vehicle) => vehicle.bearing,
    getColor: commonColor,
    get2dForegroundColor: foregroundColor2d,
    get2dBackgroundColor: backgroundColor2d,
    get3dColor: color3D,
    sizeScale: vehicleScale,
    dimensionMode,
    updateTriggers: {
      sizeScale: [vehicleScale],
    },
    getVehicleType: (vehicle: Vehicle) => {
      return vehicle.vehilceType || VehicleType.TransitBus;
    },
  });
};
