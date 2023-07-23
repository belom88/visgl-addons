import { Map as MapboxMap } from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { AnimatedVehicle } from '../../utils/vehicles-utils';
import useMapboxHook from '../../hooks/use-mapbox-hook/use-mapbox-hook';
import { MapboxLayer } from '@deck.gl/mapbox/typed';
import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';
import { StyledMapContainer } from '../common-styled';
import { BaseMapProviderId } from '../../constants/base-map-providers';

const VEHICLE_LAYER_ID = 'transit-model-vehicle-layer';

/* eslint-disable-next-line */
export interface InterleavedMapProps {
  vehicles: AnimatedVehicle[];
  baseMapProviderId?: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2;
  mapStyle?: string;
}

export const getLabelLayerId = (map: MapboxMap): string | undefined => {
  // Insert the layer beneath any symbol layer.
  let layers = map.getStyle().layers;
  if (layers == null) {
    layers = [];
  }
  const labelLayerId = layers.find(
    (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
  )?.id;
  return labelLayerId;
};

export function InterleavedMap({
  vehicles,
  baseMapProviderId,
  mapStyle,
}: InterleavedMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useMapboxHook(mapContainer, baseMapProviderId, mapStyle);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (map.getLayer(VEHICLE_LAYER_ID) != null) {
      map.removeLayer(VEHICLE_LAYER_ID);
    }

    let firstLabelLayerId: undefined | string;
    if (map instanceof MapboxMap) {
      firstLabelLayerId = getLabelLayerId(map);
    }
    map.addLayer(
      // @ts-expect-error maplibre and mapbox types are not compatible
      new MapboxLayer<VehicleLayer>({
        id: 'transit-model-vehicle-layer',
        type: VehicleLayer,
        data: vehicles,
        getPosition: (vehicle: AnimatedVehicle) => [
          vehicle.longitude,
          vehicle.latitude,
        ],
        getOrientation: (vehicle: AnimatedVehicle) => [
          0,
          -vehicle.bearing + 90,
          90,
        ],
      }),
      firstLabelLayerId
    );
  }, [vehicles, map]);

  return (
    <StyledMapContainer
      ref={mapContainer}
      className="map-container"
      data-testid="MapboxContainer"
    />
  );
}

export const createInterleavedContainerWith = (
  baseMapProviderId: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2,
  mapStyle?: string
) => {
  return (props: InterleavedMapProps) => (
    <InterleavedMap
      {...props}
      baseMapProviderId={baseMapProviderId}
      mapStyle={mapStyle}
    />
  );
};

export default InterleavedMap;
