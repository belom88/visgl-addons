import type { AccessorFunction, Color } from '@deck.gl/core/typed';
import { DeckGL } from '@deck.gl/react/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';
import { Map } from 'react-map-gl/maplibre';
import { AnimatedVehicle, Vehicle, getVehicles } from '../../utils/get-positions';
import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';
import { useAppSelector } from '../../redux/hooks';
import { selectAllRoutes } from '../../redux/slices/routes.slice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GeojsonRouteFeature } from '../../utils/load-routes';
import * as d3 from 'd3';
import { Feature } from 'geojson';

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
  const vehiclesRef = useRef<Vehicle[]>([]);
  // const animationStarted = useRef<boolean>(false);
  // const [animatedVehicles, setAnimatedVehicles] = useState<AnimatedVehicle[]>([])

  // animation
  // const animateLayer = useCallback(() => {
  //   animationStarted.current = true;

  //   const rerenderLayer = (): void => {
  //     const newAnimatedVehicles = animateVehicles(vehiclesRef.current, routes);
  //     setAnimatedVehicles(newAnimatedVehicles);
  //   };

  //   const animate = (): void => {
  //     rerenderLayer();
  //     window.requestAnimationFrame(animate);
  //   };

  //   window.requestAnimationFrame(animate);
  // }, [routes]);

  useEffect(() => {
    vehiclesRef.current = getVehicles(2000, routes);
    console.log(vehiclesRef.current);
    // if (!animationStarted.current) {
    //   animateLayer();
    // }
  }, [routes]);

  const getLayer = () =>
    new VehicleLayer<Vehicle>({
      id: 'transit-model-vehicle-layer',
      // data: animatedVehicles,
      data: vehiclesRef.current,
      getPosition: (vehicle: Vehicle) => [vehicle.longitude, vehicle.latitude],
      getOrientation: (vehicle: Vehicle) => [0, -vehicle.bearing + 90, 90],
      getColor: [0, 0, 255],
    });

  const getRouteColor: AccessorFunction<Feature, Color> = (
    route: Feature
  ): Color => {
    const castedRoute = route as GeojsonRouteFeature;
    const d3Color = d3.color(`#${castedRoute.properties.routeColor}`);
    if (d3Color) {
      const rgb = d3Color.rgb();
      return [rgb.r, rgb.g, rgb.b];
    }
    return [0, 0, 0];
  };

  const getRoutesLayer = useCallback(() => {
    if (!routes.length) {
      return null;
    }
    return new GeoJsonLayer({
      id: 'geojson-layer',
      data: routes,
      pickable: true,
      stroked: false,
      filled: false,
      lineWidthMinPixels: 2,
      getLineColor: getRouteColor,
      getLineWidth: 1,
      // getElevation: 30,
    });
  }, [routes]);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEWSTATE}
      controller
      layers={[ getLayer()]}
      getTooltip={({ object }) =>
        object && `${object.properties.routeLongName}`
      }
    >
      <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
    </DeckGL>
  );
}

export default Deckgl;
