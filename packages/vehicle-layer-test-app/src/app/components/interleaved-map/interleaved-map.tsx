import { Map as MapboxMap } from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { Vehicle } from '../../utils/vehicles-utils';
import { useMapbox } from '../../hooks/use-mapbox-hook/use-mapbox-hook';
import { StyledMapContainer } from '../common-styled';
import { BaseMapProviderId } from '../../constants/base-map-providers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectAllColors,
  selectDimensionMode,
  selectPickableState,
  selectScale,
  selectSize,
  selectSizeMode,
} from '../../redux/slices/layer-props.slice';
import { getMapboxLayer } from '../../utils/deckgl-layers-utils';
import { appActions } from '../../redux/slices/app.slice';

const VEHICLE_LAYER_ID = 'transit-model-vehicle-layer';

/* eslint-disable-next-line */
export interface InterleavedMapProps {
  vehicles: Vehicle[];
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
  const dispatch = useAppDispatch();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useMapbox(mapContainer, baseMapProviderId, mapStyle);
  const sizeMode = useAppSelector(selectSizeMode);
  const size = useAppSelector(selectSize);
  const vehicleScale = useAppSelector(selectScale);
  const dimensionMode = useAppSelector(selectDimensionMode);
  const pickableState = useAppSelector(selectPickableState);
  const colors = useAppSelector(selectAllColors);

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
    const [commonColor, foregroundColor2d, backgroundColor2d, color3D] = colors;
    map.addLayer(
      // @ts-expect-error maplibre and mapbox types are not compatible
      getMapboxLayer(
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
        commonColor,
        foregroundColor2d,
        backgroundColor2d,
        color3D
      ),
      firstLabelLayerId
    );
  }, [
    vehicles,
    map,
    sizeMode,
    size,
    vehicleScale,
    dimensionMode,
    colors,
    dispatch,
    pickableState,
  ]);

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
