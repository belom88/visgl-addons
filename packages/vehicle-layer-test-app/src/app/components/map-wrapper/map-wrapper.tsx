import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectVehiclesCount } from '../../redux/slices/layer-props.slice';
import { selectAllRoutes } from '../../redux/slices/routes.slice';
import { GeojsonRouteFeature } from '../../utils/load-routes';
import DeckglWrapper from '../deckgl/deckgl-wrapper';
import {
  AnimatedVehicle,
  Vehicle,
  animateVehicles,
  createVehicles,
} from '../../utils/vehicles-utils';
import { selectBaseMapMode } from '../../redux/slices/app.slice';
import { BaseMapMode } from '../../types';
import InterleavedMap from '../interleaved-map/interleaved-map';

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

  const baseMapMode = useAppSelector(selectBaseMapMode);

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

  return (
    <>
      {baseMapMode === BaseMapMode.OVERLAID && (
        <DeckglWrapper vehicles={animatedVehicles} />
      )}
      {baseMapMode === BaseMapMode.INTERLEAVED && (
        <InterleavedMap vehicles={animatedVehicles} />
      )}
    </>
  );
}

export default MapWrapper;
