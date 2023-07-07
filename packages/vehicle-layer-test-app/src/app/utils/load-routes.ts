import { load } from '@loaders.gl/core';
import { _GeoJSONLoader } from '@loaders.gl/json';
import { Feature, FeatureCollection, LineString } from 'geojson';

export interface GeojsonRouteProperties {
  routeId: string;
  agencyId: string;
  routeShortName: string;
  routeLongName: string;
  routeDesc: string;
  routeType: string;
  routeUrl: string;
  routeColor: string;
  routeTextColor: string;
  shapeId: string;
  distancesPerPoint: number[];
}

export type GeojsonRouteFeature = Feature<LineString, GeojsonRouteProperties>;

export type GeojsonRoute = FeatureCollection<LineString, GeojsonRouteProperties>;

export const loadRoutes = async (): Promise<GeojsonRouteFeature[]> => {
  const routesJson: GeojsonRoute = await load(
    '/sf_routes.geojson',
    _GeoJSONLoader
  );
  return routesJson.features;
};
