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
import styled from 'styled-components';
import { selectVehiclesCount } from '../../redux/slices/layer-props.slice';

const INITIAL_VIEWSTATE = {
  latitude: 37.793300,
  longitude: -122.396326,
  zoom: 20,
  maxZoom: 25,
  bearing: 0,
  pitch: 50,
};

const DeckGLContainer = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

/* eslint-disable-next-line */
export interface DeckglWrapperProps {}

export function DeckglWrapper(props: DeckglWrapperProps) {
  const vehiclesCount = useAppSelector(selectVehiclesCount);
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
    if (!animationStarted.current) {
      animateLayer();
    }
  }, [routes, animateLayer]);

  useEffect(() => {
    vehiclesRef.current = createVehicles(vehiclesCount, routes);
  }, [vehiclesCount, routes]);

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
    <DeckGLContainer>
      <DeckGL
        initialViewState={INITIAL_VIEWSTATE}
        controller
        layers={[getLayer()]}
      >
        <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
      </DeckGL>
    </DeckGLContainer>
  );
}

export default DeckglWrapper;
