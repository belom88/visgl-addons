import type { Map as MaplibreMap } from 'react-map-gl/maplibre';
import type { Map as MapboxMap } from 'react-map-gl';
import { DeckGL } from '@deck.gl/react/typed';

import { Vehicle } from '../../utils/vehicles-utils';
import { useAppSelector } from '../../redux/hooks';
import { selectMapState } from '../../redux/slices/map.slice';
import { StyledMapContainer } from '../common-styled';
import {
  selectAllColors,
  selectDimensionMode,
  selectScale,
} from '../../redux/slices/layer-props.slice';
import { renderVehicleLayer } from '../../utils/deckgl-layers-utils';

/* eslint-disable-next-line */
export interface DeckglWrapperProps {
  vehicles: Vehicle[];
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
  const dimensionMode = useAppSelector(selectDimensionMode);
  const colors = useAppSelector(selectAllColors);

  const getLayer = () =>
    renderVehicleLayer(vehicles, vehicleScale, dimensionMode, ...colors);

  return (
    <StyledMapContainer>
      <DeckGL
        initialViewState={{ ...viewState }}
        controller
        layers={[getLayer()]}
      >
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
