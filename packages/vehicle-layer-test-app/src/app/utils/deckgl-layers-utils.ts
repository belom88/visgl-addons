import { MapboxLayer } from '@deck.gl/mapbox/typed';
import { DimensionMode, VehicleLayer } from '@belom88/vehicle-layer';
import { Vehicle } from './vehicles-utils';
import { SizeMode, VehicleType } from 'packages/vehicle-layer/src/types';

/**
 * Render VehicleLayer
 * @param vehicles - data array
 * @param vehicleScale - vehicle model scale through all axes
 * @param dimensionMode - VehicleLayer dimension mode
 * @returns VehicleLayer instance
 */
export const renderVehicleLayer = (
  vehicles: Vehicle[],
  sizeMode: SizeMode,
  size: number,
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
    getPosition: (vehicle: Vehicle) => [vehicle.longitude, vehicle.latitude],
    getBearing: (vehicle: Vehicle) => vehicle.bearing,
    getColor: commonColor,
    get2dForegroundColor: foregroundColor2d,
    get2dBackgroundColor: backgroundColor2d,
    get3dColor: color3D,
    sizeMode,
    size,
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

export const getMapboxLayer = (
  vehicles: Vehicle[],
  sizeMode: SizeMode,
  size: number,
  vehicleScale: number,
  dimensionMode: DimensionMode,
  commonColor?: [number, number, number],
  foregroundColor2d?: [number, number, number],
  backgroundColor2d?: [number, number, number],
  color3D?: [number, number, number]
): MapboxLayer<VehicleLayer<Vehicle>> => {
  return new MapboxLayer<VehicleLayer<Vehicle>>({
    id: 'transit-model-vehicle-layer',
    // @ts-expect-error maplibre and mapbox types are not compatible
    type: VehicleLayer,
    data: vehicles,
    getPosition: (vehicle: Vehicle) => [vehicle.longitude, vehicle.latitude],
    getBearing: (vehicle: Vehicle) => vehicle.bearing,
    sizeMode,
    size,
    sizeScale: vehicleScale,
    dimensionMode,
    getColor: commonColor,
    get2dForegroundColor: foregroundColor2d,
    get2dBackgroundColor: backgroundColor2d,
    get3dColor: color3D,
    getVehicleType: (vehicle: Vehicle) => {
      return vehicle.vehilceType || VehicleType.TransitBus;
    },
  });
};
