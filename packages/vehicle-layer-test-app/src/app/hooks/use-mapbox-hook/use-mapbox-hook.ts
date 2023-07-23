import { Map as MaplibreMap } from 'maplibre-gl';
import mapboxgl, { LngLatLike, Map as MapboxMap } from 'mapbox-gl';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { mapActions, selectMapState } from '../../redux/slices/map.slice';
import { BaseMapProviderId } from '../../constants/base-map-providers';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

export const useMapbox = (
  mapContainer: MutableRefObject<null | HTMLDivElement>,
  baseMapProviderId?: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2,
  mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
): MaplibreMap | MapboxMap | null => {
  const [map, setMap] = useState<MaplibreMap | MapboxMap | null>(null);
  const dispatch = useAppDispatch();
  const { longitude, latitude, zoom, pitch, bearing } =
    useAppSelector(selectMapState);
  const isLoadingRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  useEffect(() => {
    if (mapContainer.current == null) {
      return;
    }

    if (map != null || isLoadingRef.current) {
      return; // initialize map only once
    }

    const mapOptions: {
      container: HTMLDivElement;
      style: string;
      center: LngLatLike;
      zoom: number;
      pitch: number;
      bearing: number;
    } = {
      container: mapContainer.current,
      style: mapStyle,
      center: [longitude, latitude],
      zoom,
      pitch,
      bearing,
    };

    let newMap: MapboxMap | MaplibreMap;
    if (baseMapProviderId === BaseMapProviderId.mapbox2) {
      newMap = new MapboxMap(mapOptions);
    } else {
      newMap = new MaplibreMap(mapOptions);
    }
    isLoadingRef.current = true;

    newMap.on('style.load', () => {
      setMap(newMap);
    });

    newMap.on('move', () => {
      const center = newMap.getCenter();
      dispatch(
        mapActions.setMapState({
          longitude: center.lng,
          latitude: center.lat,
          zoom: newMap.getZoom(),
        })
      );
    });
  }, [
    mapContainer,
    dispatch,
    longitude,
    latitude,
    zoom,
    bearing,
    pitch,
    baseMapProviderId,
    mapStyle,
    map,
  ]);

  return map;
};
