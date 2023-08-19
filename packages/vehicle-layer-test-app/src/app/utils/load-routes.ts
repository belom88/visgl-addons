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

export type GeojsonRoute = FeatureCollection<
  LineString,
  GeojsonRouteProperties
>;

const loadRoutes = async (url: string): Promise<GeojsonRouteFeature[]> => {
  const routesJson: GeojsonRoute = await load(url, _GeoJSONLoader);
  return routesJson.features;
};

export const loadRoutes2d = () => loadRoutes('/sf_routes.geojson');
export const loadRoutes3d = () => loadRoutes('/sf_routes_3d.geojson');
