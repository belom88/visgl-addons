import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map as MaplibreMap } from 'react-map-gl/maplibre';
import { Map as MapboxMap } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
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
  appActions,
  selectBaseMapMode,
  selectMapProvider,
} from '../../redux/slices/app.slice';
import { BaseMapMode } from '../../types';
import { createInterleavedContainerWith } from '../interleaved-map/interleaved-map';
import { BaseMapProviderId } from '../../constants/base-map-providers';
import { createGoogleMapWith } from '../google-maps-wrapper/google-maps-wrapper';
import ArcgisWrapper from '../arcgis-wrapper/arcgis-wrapper';
import Unsupported from '../unsupported/unsupported';
import { calculateCurrentFps, updateAverageFps } from '../../utils/fps-utils';

const mapboxAccessToken = import.meta.env.VITE_MAPBOX_API_KEY;

/* eslint-disable-next-line */
export interface MapWrapperProps {}

export function MapWrapper(props: MapWrapperProps) {
  const dispatch = useAppDispatch();
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

  const fpsRef = useRef<{ value: number; count: number }>({
    value: 0,
    count: 0,
  });

  const animateLayer = useCallback(() => {
    animationStarted.current = true;

    const rerenderLayer = (): void => {
      const newAnimatedVehicles = animateVehicles(
        vehiclesRef.current,
        routesRef.current
      );
      setAnimatedVehicles(newAnimatedVehicles);
    };

    let then = 0;
    const animate = (now: number): void => {
      const { currentFps, newThen } = calculateCurrentFps(then, now);
      then = newThen;
      fpsRef.current = updateAverageFps(fpsRef.current, currentFps);

      dispatch(appActions.setFps(fpsRef.current.value));
      rerenderLayer();
      window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
  }, [dispatch]);

  useEffect(() => {
    if (!animationStarted.current) {
      animateLayer();
    }
  }, [routes, animateLayer]);

  useEffect(() => {
    vehiclesRef.current = createVehicles(vehiclesCount, routes);
  }, [vehiclesCount, routes]);

  useEffect(() => {
    dispatch(appActions.resetFps());
    fpsRef.current = { value: 60, count: 1 };
  }, [baseMapMode, mapProvider, vehiclesCount, fpsRef, dispatch]);

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
