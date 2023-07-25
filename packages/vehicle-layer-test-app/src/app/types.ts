import { DimentionalMode } from '@belom88/deckgl-vehicle-layer';

export enum RequestStatus {
  IDLE,
  LOADING,
  SUCCEDED,
  FAILED,
}

export type BaseMapProvider = {
  name: string;
  id: string;
};

export enum BaseMapMode {
  OVERLAID = 'overlaid',
  INTERLEAVED = 'interleaved',
}

export interface LayerPropsEdited {
  // Scene properties
  /** Number of vehicles to put on the map */
  vehiclesCountValue: number;
  vehiclesCountMinMax: [number, number];
  /** Is animation switched on */
  animated: boolean;

  // Vehicle properties
  /** Vehicle model scale */
  scale: number;
  dimentionalMode: DimentionalMode;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  layerProps: LayerPropsEdited;
}
