import { type Map as MaplibreMap } from 'react-map-gl/maplibre';
import { Source, type Map as MapboxMap, MapRef } from 'react-map-gl';
import { DeckGL } from '@deck.gl/react/typed';

import { Vehicle } from '../../utils/vehicles-utils';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { mapActions, selectMapState } from '../../redux/slices/map.slice';
import { StyledMapContainer } from '../common-styled';
import {
  selectAllColors,
  selectDimensionMode,
  selectPickableState,
  selectScale,
  selectSize,
  selectSizeMode,
  selectTerrainState,
} from '../../redux/slices/layer-props.slice';
import { renderVehicleLayer } from '../../utils/deckgl-layers-utils';
import { appActions } from '../../redux/slices/app.slice';
import { ViewStateChangeParameters } from '@deck.gl/core/typed/controllers/controller';
import { useRef } from 'react';

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
  const dispatch = useAppDispatch();
  const viewState = useAppSelector(selectMapState);
  const sizeMode = useAppSelector(selectSizeMode);
  const size = useAppSelector(selectSize);
  const vehicleScale = useAppSelector(selectScale);
  const dimensionMode = useAppSelector(selectDimensionMode);
  const colors = useAppSelector(selectAllColors);
  const pickableState = useAppSelector(selectPickableState);
  const terrainState = useAppSelector(selectTerrainState);

  const mapRef = useRef<MapRef>(null);

  const getLayer = () =>
    renderVehicleLayer(
      vehicles,
      sizeMode,
      size,
      vehicleScale,
      dimensionMode,
      pickableState,
      (pickingInfo) => {
        dispatch(appActions.setPickingData(pickingInfo.object));
        return true;
      },
      ...colors
    );

  const onViewStateChangeHandler = ({
    viewState,
  }: ViewStateChangeParameters) => {
    const { latitude, longitude, zoom, bearing, pitch } = viewState;
    let mapboxElevation = 0;
    const center = mapRef.current?.getCenter();
    if (center) {
      const result = mapRef.current?.queryTerrainElevation(center);
      if (typeof result === 'number') {
        mapboxElevation = result;
      }
    }

    dispatch(
      mapActions.setMapState({
        latitude,
        longitude,
        zoom,
        bearing,
        pitch,
        position: [0, 0, mapboxElevation],
      })
    );
  };

  return (
    <StyledMapContainer>
      <DeckGL
        // initialViewState={{ ...viewState }}
        viewState={{ ...viewState }}
        onViewStateChange={onViewStateChangeHandler}
        controller
        layers={[getLayer()]}
      >
        {Map && (
          <Map
            ref={mapRef}
            mapboxAccessToken={mapboxAccessToken}
            mapStyle={mapStyle}
            terrain={
              terrainState
                ? { source: 'mapbox-dem', exaggeration: 1 }
                : undefined
            }
          >
            <Source
              id="mapbox-dem"
              type="raster-dem"
              url="mapbox://mapbox.mapbox-terrain-dem-v1"
              tileSize={512}
              maxzoom={14}
            />
          </Map>
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
