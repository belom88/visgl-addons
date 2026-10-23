import { Map as MapboxMap } from 'mapbox-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { useEffect, useRef, useMemo } from 'react';
import { Vehicle } from '../../utils/vehicles-utils';
import { useMapbox } from '../../hooks/use-mapbox-hook/use-mapbox-hook';
import { StyledMapContainer } from '../common-styled';
import {
  BaseMapProviderId,
  MAP_PROVIDER_PROPERTIES,
} from '../../constants/base-map-providers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
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

export interface InterleavedMapInternalProps {
  vehicles: Vehicle[];
  baseMapProviderId: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2;
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
}: InterleavedMapInternalProps) {
  const dispatch = useAppDispatch();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useMapbox(mapContainer, baseMapProviderId);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const sizeMode = useAppSelector(selectSizeMode);
  const size = useAppSelector(selectSize);
  const vehicleScale = useAppSelector(selectScale);
  const dimensionMode = useAppSelector(selectDimensionMode);
  const pickableState = useAppSelector(selectPickableState);
  const terrainState = useAppSelector(selectTerrainState);
  const colors = useAppSelector(selectAllColors);

  const mapProviderProps = useMemo(
    () => MAP_PROVIDER_PROPERTIES[baseMapProviderId],
    [baseMapProviderId]
  );

  useEffect(() => {
    if (!map) return;
    const overlay = new MapboxOverlay({ interleaved: true, layers: [] });
    map.addControl(overlay);
    overlayRef.current = overlay;
    return () => {
      overlayRef.current = null;
      map.removeControl(overlay);
    };
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (terrainState) {
      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({
        source: mapProviderProps.terrainProps.id,
        exaggeration: 1,
      });
    } else {
      // @ts-expect-error setTerrain expects properties
      map.setTerrain();
    }
  }, [map, baseMapProviderId, terrainState, mapProviderProps]);

  useEffect(() => {
    if (!map) {
      return;
    }

    let firstLabelLayerId: undefined | string;
    if (map instanceof MapboxMap) {
      firstLabelLayerId = getLabelLayerId(map);
    }
    const [commonColor, foregroundColor2d, backgroundColor2d, color3D] = colors;

    if (terrainState && baseMapProviderId === BaseMapProviderId.mapbox2) {
      for (const vehicle of vehicles) {
        const mapboxElevation = map?.queryTerrainElevation({
          lng: vehicle.longitude,
          lat: vehicle.latitude,
        });
        if (typeof mapboxElevation === 'number') {
          vehicle.elevation = mapboxElevation;
        }
      }
    }

    const vehicleLayer = renderVehicleLayer(
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
      terrainState,
      commonColor,
      foregroundColor2d,
      backgroundColor2d,
      color3D,
      firstLabelLayerId
    );
    overlayRef.current?.setProps({ layers: [vehicleLayer] });
  }, [
    vehicles,
    map,
    terrainState,
    sizeMode,
    size,
    vehicleScale,
    dimensionMode,
    colors,
    dispatch,
    pickableState,
    baseMapProviderId,
  ]);

  return (
    <StyledMapContainer
      ref={mapContainer}
      className="map-container"
      data-testid="MapboxContainer"
    />
  );
}

export default InterleavedMap;
