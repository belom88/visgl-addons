import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map as MaplibreMap } from 'react-map-gl/maplibre';
import { Map as MapboxMap } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import { createDeckglWith } from '../deckgl-wrapper/deckgl-wrapper';
import { createInterleavedContainerWith } from '../interleaved-map/interleaved-map';
import { createGoogleMapWith } from '../google-maps-wrapper/google-maps-wrapper';
import ArcgisWrapper from '../arcgis-wrapper/arcgis-wrapper';

import {
  selectAnimationState,
  selectTerrainState,
  selectUseCase,
  selectVehiclesCountValue,
} from '../../redux/slices/layer-props.slice';
import {
  selectAllRoutes2d,
  selectAllRoutes3d,
} from '../../redux/slices/routes.slice';
import { GeojsonRouteFeature } from '../../utils/load-routes';
import {
  Vehicle,
  SfVehicle,
  animateVehicles,
  createSfVehicles,
  createAnfieldVehicles,
} from '../../utils/vehicles-utils';
import {
  appActions,
  selectBaseMapMode,
  selectMapProvider,
} from '../../redux/slices/app.slice';
import { BaseMapMode, UseCaseId } from '../../types';

import { BaseMapProviderId } from '../../constants/base-map-providers';
import Unsupported from '../unsupported/unsupported';
import { calculateCurrentFps, updateAverageFps } from '../../utils/fps-utils';
import { mapActions } from '../../redux/slices/map.slice';
import { anfieldViewState, sfViewState } from '../../constants/view-states';

const mapboxAccessToken = import.meta.env.VITE_MAPBOX_API_KEY;

/* eslint-disable-next-line */
export interface MapWrapperProps {}

export function MapWrapper(props: MapWrapperProps) {
  const dispatch = useAppDispatch();
  const useCase = useAppSelector(selectUseCase);
  const vehiclesCount = useAppSelector(selectVehiclesCountValue);

  const animationState = useAppSelector(selectAnimationState);
  const animationStateRef = useRef<boolean>(true);
  animationStateRef.current = animationState;

  const terrainState = useAppSelector(selectTerrainState);

  const routes2d: GeojsonRouteFeature[] = useAppSelector(selectAllRoutes2d);
  const routes3d: GeojsonRouteFeature[] = useAppSelector(selectAllRoutes3d);
  const routesRef = useRef<GeojsonRouteFeature[]>(routes2d);

  const sfVehiclesRef = useRef<SfVehicle[]>([]);
  const anfieldVehiclesRef = useRef<Vehicle[]>(createAnfieldVehicles());
  const animationStarted = useRef<boolean>(false);
  const [animatedVehicles, setAnimatedVehicles] = useState<Vehicle[]>([]);
  const animatedVehiclesRef = useRef<Vehicle[]>([]);
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
      const sfAnimatedVehicles = animateVehicles(
        sfVehiclesRef.current,
        routesRef.current
      );
      const newAnimatedVehicles = sfAnimatedVehicles.concat(
        anfieldVehiclesRef.current
      );
      setAnimatedVehicles(newAnimatedVehicles);
    };

    let then = 0;
    const animate = (now: number): void => {
      const { currentFps, newThen } = calculateCurrentFps(then, now);
      then = newThen;
      fpsRef.current = updateAverageFps(fpsRef.current, currentFps);

      dispatch(appActions.setFps(fpsRef.current.value));
      if (animationStateRef.current || !animatedVehiclesRef.current.length) {
        rerenderLayer();
      }

      window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
  }, [dispatch, animationStateRef, animatedVehiclesRef]);

  useEffect(() => {
    if (!animationStarted.current) {
      animateLayer();
    }
  }, [animateLayer]);

  useEffect(() => {
    if (terrainState) {
      routesRef.current = routes3d;
    } else {
      routesRef.current = routes2d;
    }
  }, [routes2d, routes3d, terrainState]);

  useEffect(() => {
    if (useCase === UseCaseId.SF_TRANSIT) {
      sfVehiclesRef.current = createSfVehicles(
        vehiclesCount,
        terrainState ? routes3d : routes2d
      );
    } else {
      sfVehiclesRef.current = [];
    }
  }, [
    vehiclesCount,
    routes2d,
    routes3d,
    terrainState,
    animationState,
    useCase,
  ]);

  useEffect(() => {
    if (useCase === UseCaseId.SF_TRANSIT) {
      dispatch(mapActions.setMapState(sfViewState));
    } else if (useCase === UseCaseId.ANFIELD) {
      dispatch(mapActions.setMapState(anfieldViewState));
    }
  }, [useCase, dispatch]);

  useEffect(() => {
    dispatch(appActions.resetFps());
    fpsRef.current = { value: 60, count: 1 };
    setAnimatedVehicles([]);
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
