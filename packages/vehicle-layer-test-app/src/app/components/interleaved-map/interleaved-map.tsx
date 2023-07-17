import { useEffect, useRef } from 'react';
import { AnimatedVehicle } from '../../utils/vehicles-utils';
import useMaplibreHook from '../../hooks/use-maplibre-hook/use-maplibre-hook';
import { MapboxLayer } from '@deck.gl/mapbox/typed';
import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';
import { StyledMapContainer } from '../common-styled';

const VEHICLE_LAYER_ID = 'transit-model-vehicle-layer';

/* eslint-disable-next-line */
export interface InterleavedMapProps {
  vehicles: AnimatedVehicle[];
}

export function InterleavedMap({ vehicles }: InterleavedMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useMaplibreHook(mapContainer);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (map.getLayer(VEHICLE_LAYER_ID) != null) {
      map.removeLayer(VEHICLE_LAYER_ID);
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
      })
    );
  }, [vehicles, mapRef]);

  return (
    <StyledMapContainer
      ref={mapContainer}
      className="map-container"
      data-testid="MapboxContainer"
    />
  );
}

export default InterleavedMap;
