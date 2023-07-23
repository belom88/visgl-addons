import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map as MaplibreMap } from 'react-map-gl/maplibre';
import { Map as MapboxMap } from 'react-map-gl';
import { useAppSelector } from '../../redux/hooks';
import { selectVehiclesCount } from '../../redux/slices/layer-props.slice';
import { selectAllRoutes } from '../../redux/slices/routes.slice';
import { GeojsonRouteFeature } from '../../utils/load-routes';
import { createDeckglWith } from '../deckgl-wrapper/deckgl-wrapper';
import {
  AnimatedVehicle,
  Vehicle,
  animateVehicles,
  createVehicles,
} from '../../utils/vehicles-utils';
import {
  selectBaseMapMode,
  selectMapProvider,
} from '../../redux/slices/app.slice';
import { BaseMapMode } from '../../types';
import { createInterleavedContainerWith } from '../interleaved-map/interleaved-map';
import { BaseMapProviderId } from '../../constants/base-map-providers';
import { createGoogleMapWith } from '../google-maps-wrapper/google-maps-wrapper';
import ArcgisWrapper from '../arcgis-wrapper/arcgis-wrapper';
import Unsupported from '../unsupported/unsupported';

const mapboxAccessToken = import.meta.env.VITE_MAPBOX_API_KEY;

/* eslint-disable-next-line */
export interface MapWrapperProps {}

export function MapWrapper(props: MapWrapperProps) {
  const vehiclesCount = useAppSelector(selectVehiclesCount);

  const routes: GeojsonRouteFeature[] = useAppSelector(selectAllRoutes);
  const routesRef = useRef<GeojsonRouteFeature[]>(routes);
  routesRef.current = routes;

  const vehiclesRef = useRef<Vehicle[]>([]);
  const animationStarted = useRef<boolean>(false);
  const [animatedVehicles, setAnimatedVehicles] = useState<AnimatedVehicle[]>(
    []
  );
  const animatedVehiclesRef = useRef<AnimatedVehicle[]>([]);
  animatedVehiclesRef.current = animatedVehicles;

  const baseMapMode = useAppSelector(selectBaseMapMode);
  const mapProvider = useAppSelector(selectMapProvider);

  const animateLayer = useCallback(() => {
    animationStarted.current = true;

    const rerenderLayer = (): void => {
      const newAnimatedVehicles = animateVehicles(
        vehiclesRef.current,
        routesRef.current
      );
      setAnimatedVehicles(newAnimatedVehicles);
    };

    const animate = (): void => {
      rerenderLayer();
      window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!animationStarted.current) {
      animateLayer();
    }
  }, [routes, animateLayer]);

  useEffect(() => {
    vehiclesRef.current = createVehicles(vehiclesCount, routes);
  }, [vehiclesCount, routes]);

  const DeckglComponent = useMemo(() => {
    switch (mapProvider.id) {
      case BaseMapProviderId.maplibre:
        return createDeckglWith(MaplibreMap);
      case BaseMapProviderId.mapbox2:
        return createDeckglWith(
          MapboxMap,
          mapboxAccessToken,
          'mapbox://styles/mapbox/streets-v12'
        );
      case BaseMapProviderId.googleMaps:
        return createGoogleMapWith(false);
      case BaseMapProviderId.arcgis:
        return Unsupported;
      default:
        return null;
    }
  }, [mapProvider]);

  const InterleavedComponent = useMemo(() => {
    switch (mapProvider.id) {
      case BaseMapProviderId.maplibre:
        return createInterleavedContainerWith(mapProvider.id);
      case BaseMapProviderId.mapbox2:
        return createInterleavedContainerWith(
          mapProvider.id,
          'mapbox://styles/mapbox/streets-v12'
        );
      case BaseMapProviderId.googleMaps:
        return createGoogleMapWith(true);
      case BaseMapProviderId.arcgis:
        return ArcgisWrapper;
      default:
        return null;
    }
  }, [mapProvider]);

  return (
    <>
      {baseMapMode === BaseMapMode.OVERLAID && DeckglComponent && (
        <DeckglComponent vehicles={animatedVehicles} />
      )}
      {baseMapMode === BaseMapMode.INTERLEAVED && InterleavedComponent && (
        <InterleavedComponent vehicles={animatedVehicles} />
      )}
    </>
  );
}

export default MapWrapper;
