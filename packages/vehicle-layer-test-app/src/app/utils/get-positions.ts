import { Vector3, toDegrees, toRadians } from '@math.gl/core';
import { Ellipsoid } from '@math.gl/geospatial';
import { GeojsonRouteFeature } from './load-routes';

export type Vehicle = {
  latitude: number;
  longitude: number;
  bearing: number;
  routeIndex: number;
  pointIndex: number;
};

export type AnimatedVehicle = {
  latitude: number;
  longitude: number;
  bearing: number;
};

const scratchVector = new Vector3();
const scratchVector2 = new Vector3();
const METERS_PER_MILE = 1609.34;

/**
 * Calculate bearing for a vechile going from coords1 to coords 2
 * @param start start point cartographic coordinates
 * @param end end point cartographic coordinates
 * @returns angle between the vehicle direction and the north direction
 */
const calculateBearing = (start: number[], end: number[]): number => {
  const long1 = toRadians(start[0]);
  const lat1 = toRadians(start[1]);
  const long2 = toRadians(end[0]);
  const lat2 = toRadians(end[1]);

  // Calculate the bearing
  let bearing = Math.atan2(
    Math.sin(long2 - long1) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(long2 - long1)
  );
  // Convert the bearing to degrees
  bearing = toDegrees(bearing);
  // Make sure the bearing is positive
  bearing = (bearing + 360) % 360;
  return bearing;
};

/**
 * Calculate distance between 2 points
 * @param coords1 - cartographic point
 * @param coords2 - cartographic point
 * @returns distance in meters
 */
// const calculateDistance = (coords1: number[], coords2: number[]): number => {
//   Ellipsoid.WGS84.cartographicToCartesian(coords1, scratchVector);
//   const cartesianCoords1 = [...scratchVector];
//   Ellipsoid.WGS84.cartographicToCartesian(coords2, scratchVector);
//   const cartesianCoords2 = [...scratchVector];
//   return scratchVector
//     .copy(cartesianCoords1)
//     .subtract(cartesianCoords2)
//     .magnitude();
// };

/**
 * Calculate position between points having distance covered
 * @param start catrographic position
 * @param end catrographic position
 * @param distanceCovered distance covered in meters
 */
const getPositionBetween = (
  start: number[],
  end: number[],
  distanceCovered: number
): number[] => {
  Ellipsoid.WGS84.cartographicToCartesian([...start, 0], scratchVector);
  Ellipsoid.WGS84.cartographicToCartesian([...end, 0], scratchVector2);
  scratchVector2.subtract(scratchVector);
  scratchVector2.normalize().scale(distanceCovered * METERS_PER_MILE);
  scratchVector.add(scratchVector2);
  Ellipsoid.WGS84.cartesianToCartographic(scratchVector, scratchVector);
  return [...scratchVector];
};

export const getVehicles = (
  totalVehiclesCount: number,
  routes: GeojsonRouteFeature[]
): Vehicle[] => {
  const routesLength = routes.reduce(
    (acc: number, route: GeojsonRouteFeature) => {
      const distances = route.properties.distancesPerPoint;
      return acc + distances[distances.length - 1];
    },
    0
  );
  const vehicles: Vehicle[] = [];
  for (let routeIndex = 0; routeIndex < routes.length; routeIndex++) {
    const route = routes[routeIndex];
    const distances = route.properties.distancesPerPoint;
    const routeLength = distances[distances.length - 1];
    const vehiclesOnRoute = (routeLength / routesLength) * totalVehiclesCount;
    const distanceBetweenVehicles = routeLength / vehiclesOnRoute;
    let currentDistance = 0;
    for (let i = 0; i < distances.length; i++) {
      const pointDistance = distances[i];
      while (pointDistance >= currentDistance) {
        let startIndex = i - 1;
        let endIndex = i;

        // Out of the route, break;
        if (pointDistance === currentDistance && i === 0) {
          startIndex = i;
          endIndex = i + 1;
        }

        // Calculate point between start and end
        const distanceCovered = currentDistance - distances[startIndex];
        const position = getPositionBetween(
          route.geometry.coordinates[startIndex],
          route.geometry.coordinates[endIndex],
          distanceCovered
        );

        // Calculate  bearing
        const bearing = calculateBearing(
          route.geometry.coordinates[startIndex],
          route.geometry.coordinates[endIndex]
        );

        vehicles.push({
          longitude: position[0],
          latitude: position[1],
          bearing,
          routeIndex,
          pointIndex: i,
        });
        currentDistance += distanceBetweenVehicles;
      }
    }
  }
  return vehicles;
};
