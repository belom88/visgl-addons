import { useEffect, useRef } from 'react';
import { AnimatedVehicle } from '../../utils/vehicles-utils';
import { useArcgis } from '../../hooks/use-arcgis-hook/use-arcgis-hook';
import { StyledMapContainer } from '../common-styled';
import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';

/* eslint-disable-next-line */
export interface ArcgisWrapperProps {
  vehicles: AnimatedVehicle[];
}

export function ArcgisWrapper({ vehicles }: ArcgisWrapperProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map: unknown | null = useArcgis(mapContainer);

  const getLayer = (vehicles: AnimatedVehicle[]) =>
    new VehicleLayer<AnimatedVehicle>({
      id: 'transit-model-vehicle-layer',
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
    });

  useEffect(() => {
    if (!map) {
      return;
    }

    const layers = [getLayer(vehicles)];
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.set({ layers });
  }, [vehicles, map]);

  return (
    <StyledMapContainer
      ref={mapContainer}
      className="map-container"
      data-testid="ArcgisContainer"
    />
  );
}

export default ArcgisWrapper;
