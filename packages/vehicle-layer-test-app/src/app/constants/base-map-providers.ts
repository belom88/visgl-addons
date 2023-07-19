import { BaseMapProvider } from '../types';

export enum BaseMapProviderId {
  maplibre = 'maplibre',
  mapbox2 = 'mapbox2',
  googleMaps = 'google-maps',
  arcgis = 'arcgis',
}

export const BASE_MAP_PROVIDERS: BaseMapProvider[] = [
  { name: 'MapLibre', id: BaseMapProviderId.maplibre },
  { name: 'Mapbox 2', id: BaseMapProviderId.mapbox2 },
  { name: 'Google Maps', id: BaseMapProviderId.googleMaps },
  { name: 'ArcGIS', id: BaseMapProviderId.arcgis },
];
