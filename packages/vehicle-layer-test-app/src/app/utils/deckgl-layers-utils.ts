import { MapboxLayer } from '@deck.gl/mapbox/typed';
import { DimensionMode, VehicleLayer } from '@belom88/vehicle-layer';
import { Vehicle } from './vehicles-utils';
import { VehicleSizeMode, VehicleType } from 'packages/vehicle-layer/src/types';
import { PickingInfo } from '@deck.gl/core/typed';

/**
 * Render VehicleLayer
 * @param vehicles - data array
 * @param vehicleScale - vehicle model scale through all axes
 * @param dimensionMode - VehicleLayer dimension mode
 * @returns VehicleLayer instance
 */
export const renderVehicleLayer = (
  vehicles: Vehicle[],
  sizeMode: VehicleSizeMode,
  size: number,
  vehicleScale: number,
  dimensionMode: DimensionMode,
  pickable: boolean,
  onClick: (info: PickingInfo) => boolean,
  showElevation = false,
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
      showElevation ? vehicle.elevation : 0,
    ],
    getBearing: (vehicle: Vehicle) => vehicle.bearing,
    getColor: commonColor,
    get2dForegroundColor: foregroundColor2d,
    get2dBackgroundColor: backgroundColor2d,
    get3dColor: color3D,
    sizeMode,
    size,
    sizeScale: vehicleScale,
    dimensionMode,
    pickable,
    onClick,
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
  sizeMode: VehicleSizeMode,
  size: number,
  vehicleScale: number,
  dimensionMode: DimensionMode,
  pickable: boolean,
  onClick: (info: PickingInfo) => boolean,
  showElevation = false,
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
    getPosition: (vehicle: Vehicle) => [
      vehicle.longitude,
      vehicle.latitude,
      showElevation ? vehicle.elevation : 0,
    ],
    getBearing: (vehicle: Vehicle) => vehicle.bearing,
    sizeMode,
    size,
    sizeScale: vehicleScale,
    dimensionMode,
    pickable,
    onClick,
    getColor: commonColor,
    get2dForegroundColor: foregroundColor2d,
    get2dBackgroundColor: backgroundColor2d,
    get3dColor: color3D,
    getVehicleType: (vehicle: Vehicle) => {
      return vehicle.vehilceType || VehicleType.TransitBus;
    },
  });
};
