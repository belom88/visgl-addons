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
  /** Number of vehicles to put on the map */
  vehiclesCount: number;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  layerProps: LayerPropsEdited;
}
