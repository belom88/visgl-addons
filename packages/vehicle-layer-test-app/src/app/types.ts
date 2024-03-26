import { type Map as MaplibreMap } from 'react-map-gl/maplibre';
import { type Map as MapboxMap } from 'react-map-gl';
import { DimensionMode, SizeMode } from '@belom88/vehicle-layer';

export enum RequestStatus {
  IDLE,
  LOADING,
  SUCCEDED,
  FAILED,
}

export enum PopoverId {
  VEHICLE_LAYER_COMMON_COLOR,
  VEHICLE_LAYER_3D_COLOR,
  VEHICLE_LAYER_2D_BACKGROUND,
  VEHICLE_LAYER_2D_FOREGROUND,
}

export type BaseMapProvider = {
  name: string;
  id: string;
};

export type MapboxTerrainProfile = {
  id: string;
  type: 'raster-dem';
  url: string;
  tileSize: number;
  maxZoom: number;
};

export type MaplibreTerrainProfile = {
  id: string;
  type: 'raster-dem';
  tiles: string[];
  encoding: 'terrarium';
  tileSize: number;
  maxzoom: number;
};

export type BaseMapProviderProps = {
  Map: typeof MaplibreMap | typeof MapboxMap;
  mapStyle: string;
  accessToken?: string;
  terrainProps: MapboxTerrainProfile | MaplibreTerrainProfile;
};

export enum BaseMapMode {
  OVERLAID = 'overlaid',
  INTERLEAVED = 'interleaved',
}

export interface LayerPropsEdited {
  useCase: UseCaseId;

  // Scene properties
  /** Number of vehicles to put on the map */
  vehiclesCountValue: number;
  vehiclesCountMinMax: [number, number];
  /** Is animation switched on */
  animated: boolean;
  /** Is picking of vehicles enabled */
  pickable: boolean;
  /** Add terrain if possible */
  terrain: boolean;

  // Vehicle properties
  /** A way to define vehicles size */
  sizeMode: SizeMode;
  /** Size in pixels for pixel size mode */
  size: number;
  /** Vehicle model scale */
  scale: number;
  /** 2D or 3D mode */
  dimensionMode: DimensionMode;
  /** Color for useColor Accessor */
  commonColor?: [number, number, number];
  /** Color for get3dColor Accessor */
  color3D?: [number, number, number];
  /** Color for get2dForegroundColor Accessor */
  foregroundColor2d?: [number, number, number];
  /** Color for get2dBackgroundColor Accessor */
  backgroundColor2d?: [number, number, number];
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  layerProps: LayerPropsEdited;
}

export enum UseCaseId {
  SF_TRANSIT,
  ANFIELD,
}
