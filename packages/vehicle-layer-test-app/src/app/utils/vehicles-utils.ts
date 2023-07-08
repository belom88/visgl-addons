import { Vector3, toDegrees, toRadians } from '@math.gl/core';
import { Ellipsoid } from '@math.gl/geospatial';
import { GeojsonRouteFeature } from './load-routes';
import moment from 'moment';

const METERS_PER_MILE = 1609.34;
/** 15 miles/h */
const VEHICLE_SPEED = 7;
const MILLISECONDS_IN_AN_HOUR = 1000 * 60 * 60;

export type Vehicle = {
  startDateTime: number[];
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
 * Calculate position between points having distance covered
 * @param start catrographic position
 * @param end catrographic position
 * @param distanceCovered distance covered in miles
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

export const createVehicles = (
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
        const startDateTime = moment().subtract(
          (distanceCovered / VEHICLE_SPEED) * MILLISECONDS_IN_AN_HOUR
        );

        vehicles.push({
          startDateTime: startDateTime.toArray(),
          routeIndex,
          pointIndex: endIndex,
        });
        currentDistance += distanceBetweenVehicles;
      }
    }
  }
  return vehicles;
};

export const animateVehicles = (
  vehicles: Vehicle[],
  routes: GeojsonRouteFeature[]
): AnimatedVehicle[] => {
  if (!routes.length) {
    return [];
  }
  const result: AnimatedVehicle[] = [];
  for (const vehicle of vehicles) {
    const route: GeojsonRouteFeature = routes[vehicle.routeIndex];
    const duration = moment().diff(vehicle.startDateTime);
    let distanceCovered = (duration / MILLISECONDS_IN_AN_HOUR) * VEHICLE_SPEED; // miles
    const distances = route.properties.distancesPerPoint;
    let segmentDistance = 0;
    let currentPointIndex = vehicle.pointIndex;
    let currentStartDateTime = vehicle.startDateTime;
    do {
      vehicle.pointIndex = currentPointIndex;
      vehicle.startDateTime = currentStartDateTime;
      distanceCovered -= segmentDistance;
      const startPositionDistance = distances[currentPointIndex - 1];
      const endPositionDistance = distances[currentPointIndex];
      segmentDistance = endPositionDistance - startPositionDistance;
      currentPointIndex++;
      currentStartDateTime = moment().toArray();
    } while (
      distanceCovered > segmentDistance &&
      currentPointIndex < distances.length
    );

    if (
      distanceCovered > segmentDistance &&
      vehicle.pointIndex === distances.length - 1
    ) {
      continue;
    }

    const startPosition = route.geometry.coordinates[vehicle.pointIndex - 1];
    const endPosition = route.geometry.coordinates[vehicle.pointIndex];
    const position = getPositionBetween(
      startPosition,
      endPosition,
      distanceCovered
    );
    const bearing = calculateBearing(startPosition, endPosition);
    result.push({
      longitude: position[0],
      latitude: position[1],
      bearing,
    });
  }
  return result;
};