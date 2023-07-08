import { DeckGL } from '@deck.gl/react/typed';
import { Map } from 'react-map-gl/maplibre';
import {
  AnimatedVehicle,
  Vehicle,
  animateVehicles,
  createVehicles,
} from '../../utils/vehicles-utils';
import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';
import { useAppSelector } from '../../redux/hooks';
import { selectAllRoutes } from '../../redux/slices/routes.slice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GeojsonRouteFeature } from '../../utils/load-routes';

const INITIAL_VIEWSTATE = {
  latitude: 37.794254,
  longitude: -122.412004,
  zoom: 12,
  maxZoom: 25,
  bearing: 0,
  pitch: 30,
};

/* eslint-disable-next-line */
export interface DeckglProps {}

export function Deckgl(props: DeckglProps) {
  const routes: GeojsonRouteFeature[] = useAppSelector(selectAllRoutes);
  const routesRef = useRef<GeojsonRouteFeature[]>(routes);
  routesRef.current = routes;

  const vehiclesRef = useRef<Vehicle[]>([]);
  const animationStarted = useRef<boolean>(false);
  const [animatedVehicles, setAnimatedVehicles] = useState<AnimatedVehicle[]>(
    []
  );

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
    vehiclesRef.current = createVehicles(2000, routes);
    if (!animationStarted.current) {
      animateLayer();
    }
  }, [routes, animateLayer]);

  const getLayer = () =>
    new VehicleLayer<AnimatedVehicle>({
      id: 'transit-model-vehicle-layer',
      data: animatedVehicles,
      getPosition: (vehicle: AnimatedVehicle) => [
        vehicle.longitude,
        vehicle.latitude,
      ],
      getOrientation: (vehicle: AnimatedVehicle) => [
        0,
        -vehicle.bearing + 90,
        90,
      ],
    });

  return (
    <DeckGL
      initialViewState={INITIAL_VIEWSTATE}
      controller
      layers={[getLayer()]}
    >
      <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
    </DeckGL>
  );
}

export default Deckgl;
