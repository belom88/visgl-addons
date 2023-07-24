import type { Map as MaplibreMap } from 'react-map-gl/maplibre';
import type { Map as MapboxMap } from 'react-map-gl';
import { DeckGL } from '@deck.gl/react/typed';

import { AnimatedVehicle } from '../../utils/vehicles-utils';
import { useAppSelector } from '../../redux/hooks';
import { selectMapState } from '../../redux/slices/map.slice';
import { StyledMapContainer } from '../common-styled';
import { selectScale } from '../../redux/slices/layer-props.slice';
import { renderVehicleLayer } from '../../utils/deckgl-layers-utils';

/* eslint-disable-next-line */
export interface DeckglWrapperProps {
  vehicles: AnimatedVehicle[];
  Map?: typeof MaplibreMap | typeof MapboxMap;
  mapboxAccessToken?: string;
  mapStyle?: string;
}

export function DeckglWrapper({
  vehicles,
  Map,
  mapboxAccessToken,
  mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
}: DeckglWrapperProps) {
  const viewState = useAppSelector(selectMapState);
  const vehicleScale = useAppSelector(selectScale);

  const getLayer = () => renderVehicleLayer(vehicles, vehicleScale);

  return (
    <StyledMapContainer>
      <DeckGL initialViewState={viewState} controller layers={[getLayer()]}>
        {Map && (
          <Map mapboxAccessToken={mapboxAccessToken} mapStyle={mapStyle} />
        )}
      </DeckGL>
    </StyledMapContainer>
  );
}

export const createDeckglWith = (
  Map: typeof MaplibreMap | typeof MapboxMap,
  mapboxAccessToken?: string,
  mapStyle?: string
) => {
  return (props: DeckglWrapperProps) => (
    <DeckglWrapper
      {...props}
      Map={Map}
      mapboxAccessToken={mapboxAccessToken}
      mapStyle={mapStyle}
    />
  );
};

export default DeckglWrapper;