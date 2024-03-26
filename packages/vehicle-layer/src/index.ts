export type { DimensionMode } from './types';
import { VehicleType, VehicleSizeMode } from './types';
// @ts-expect-error globalThis is not typed
globalThis.VehicleType = VehicleType;
// @ts-expect-error globalThis is not typed
globalThis.VehicleSizeMode = VehicleSizeMode;
export { VehicleType, VehicleSizeMode };

import { VehicleLayer } from './lib/vehicle-layer';
// @ts-expect-error globalThis is not typed
globalThis.VehicleLayer = VehicleLayer;
export { VehicleLayer };
