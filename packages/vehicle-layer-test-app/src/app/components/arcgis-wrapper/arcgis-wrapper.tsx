import { useEffect, useRef } from 'react';
import { AnimatedVehicle } from '../../utils/vehicles-utils';
import { useArcgis } from '../../hooks/use-arcgis-hook/use-arcgis-hook';
import { StyledMapContainer } from '../common-styled';
import { renderVehicleLayer } from '../../utils/deckgl-layers-utils';
import { useAppSelector } from '../../redux/hooks';
import {
  selectDimentionalMode,
  selectScale,
} from '../../redux/slices/layer-props.slice';

/* eslint-disable-next-line */
export interface ArcgisWrapperProps {
  vehicles: AnimatedVehicle[];
}

export function ArcgisWrapper({ vehicles }: ArcgisWrapperProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map: unknown | null = useArcgis(mapContainer);
  const vehicleScale = useAppSelector(selectScale);
  const dimentionalMode = useAppSelector(selectDimentionalMode);

  useEffect(() => {
    if (!map) {
      return;
    }

    const layers = [
      renderVehicleLayer(vehicles, vehicleScale, dimentionalMode),
    ];
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.set({ layers });
  }, [vehicles, map, vehicleScale, dimentionalMode]);

  return (
    <StyledMapContainer
      ref={mapContainer}
      className="map-container"
      data-testid="ArcgisContainer"
    />
  );
}

export default ArcgisWrapper;
