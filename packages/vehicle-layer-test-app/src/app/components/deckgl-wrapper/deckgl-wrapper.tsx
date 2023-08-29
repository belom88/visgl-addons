import {
  Source as MaplibreSource,
  MapRef as MaplibreMapRef,
} from 'react-map-gl/maplibre';
import { Source as MapboxSource, MapRef as MapboxMapRef } from 'react-map-gl';
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
import { useRef, useMemo } from 'react';
import {
  BaseMapProviderId,
  MAP_PROVIDER_PROPERTIES,
} from '../../constants/base-map-providers';

const getTerrainElevation = (
  baseMapProviderId: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2,
  terrainState: boolean,
  mapRef: MaplibreMapRef | MapboxMapRef | null
) => {
  let extraElevation = 0;
  if (terrainState) {
    if (baseMapProviderId === BaseMapProviderId.mapbox2) {
      const center = mapRef?.getCenter();
      if (center) {
        const result = mapRef?.queryTerrainElevation(center);
        if (typeof result === 'number') {
          extraElevation = result;
        }
      }
    } else if (baseMapProviderId === BaseMapProviderId.maplibre) {
      const map = mapRef?.getMap();
      // @ts-expect-error transform is not typed
      extraElevation = map?.transform.elevation || 0;
    }
  }
  return extraElevation;
};

export interface DeckglWrapperProps {
  vehicles: Vehicle[];
}

export interface DeckglWrapperInternalProps {
  vehicles: Vehicle[];
  baseMapProviderId: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2;
}

export function DeckglWrapper({
  vehicles,
  baseMapProviderId,
}: DeckglWrapperInternalProps) {
  const dispatch = useAppDispatch();
  const viewState = useAppSelector(selectMapState);
  const sizeMode = useAppSelector(selectSizeMode);
  const size = useAppSelector(selectSize);
  const vehicleScale = useAppSelector(selectScale);
  const dimensionMode = useAppSelector(selectDimensionMode);
  const colors = useAppSelector(selectAllColors);
  const pickableState = useAppSelector(selectPickableState);
  const terrainState = useAppSelector(selectTerrainState);

  const mapRef = useRef<MaplibreMapRef | MapboxMapRef>(null);

  const mapProviderProps = useMemo(
    () => MAP_PROVIDER_PROPERTIES[baseMapProviderId],
    [baseMapProviderId]
  );

  const onSourceDataHandler = () => {
    const extraElevation = getTerrainElevation(
      baseMapProviderId,
      terrainState,
      mapRef.current
    );
    dispatch(
      mapActions.setMapState({
        ...viewState,
        position: [0, 0, extraElevation],
      })
    );
  };

  const getLayer = () => {
    let transformedVehicles: Vehicle[] = vehicles;
    if (terrainState && baseMapProviderId === BaseMapProviderId.mapbox2) {
      transformedVehicles = [];
      for (const vehicle of vehicles) {
        let transformedVehicle = vehicle;
        const mapboxElevation = mapRef.current?.queryTerrainElevation({
          lng: vehicle.longitude,
          lat: vehicle.latitude,
        });
        if (typeof mapboxElevation === 'number') {
          transformedVehicle = { ...vehicle };
          transformedVehicle.elevation = mapboxElevation;
        }
        transformedVehicles.push(transformedVehicle);
      }
    }

    return renderVehicleLayer(
      transformedVehicles,
      sizeMode,
      size,
      vehicleScale,
      dimensionMode,
      pickableState,
      (pickingInfo) => {
        dispatch(appActions.setPickingData(pickingInfo.object));
        return true;
      },
      terrainState,
      ...colors
    );
  };

  const onViewStateChangeHandler = ({
    viewState,
  }: ViewStateChangeParameters) => {
    const { latitude, longitude, zoom, bearing, pitch } = viewState;
    const extraElevation = getTerrainElevation(
      baseMapProviderId,
      terrainState,
      mapRef.current
    );

    dispatch(
      mapActions.setMapState({
        latitude,
        longitude,
        zoom,
        bearing,
        pitch,
        position: [0, 0, extraElevation],
      })
    );
  };

  return (
    <StyledMapContainer>
      <DeckGL
        viewState={{ ...viewState }}
        onViewStateChange={onViewStateChangeHandler}
        controller
        layers={[getLayer()]}
      >
        <mapProviderProps.Map
          // @ts-expect-error Maplibre & Mapbox types are different
          ref={mapRef}
          mapboxAccessToken={mapProviderProps.accessToken}
          mapStyle={mapProviderProps.mapStyle}
          terrain={
            terrainState
              ? { source: 'dem-data-source', exaggeration: 1 }
              : undefined
          }
          onSourceData={onSourceDataHandler}
        >
          {baseMapProviderId === BaseMapProviderId.maplibre && (
            <MaplibreSource
              id={mapProviderProps.terrainProps.id}
              type={mapProviderProps.terrainProps.type}
              tiles={[
                'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
              ]}
              encoding="terrarium"
              tileSize={256}
              maxzoom={12}
            />
          )}
          {baseMapProviderId === BaseMapProviderId.mapbox2 && (
            <MapboxSource
              id={mapProviderProps.terrainProps.id}
              type={mapProviderProps.terrainProps.type}
              url="mapbox://mapbox.mapbox-terrain-dem-v1"
              tileSize={512}
              maxzoom={14}
            />
          )}
        </mapProviderProps.Map>
      </DeckGL>
    </StyledMapContainer>
  );
}

export default DeckglWrapper;
