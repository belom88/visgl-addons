import { Map as MaplibreMap } from 'maplibre-gl';
import mapboxgl, { LngLatLike, Map as MapboxMap } from 'mapbox-gl';
import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { mapActions, selectMapState } from '../../redux/slices/map.slice';
import { BaseMapProviderId } from '../../constants/base-map-providers';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

export const useMapboxHook = (
  mapContainer: MutableRefObject<null | HTMLDivElement>,
  baseMapProviderId?: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2,
  mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
): RefObject<MaplibreMap | MapboxMap | null> => {
  const mapRef = useRef<MaplibreMap | MapboxMap | null>(null);
  const dispatch = useAppDispatch();
  const { longitude, latitude, zoom, pitch, bearing } =
    useAppSelector(selectMapState);
  const isLoadingRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      const map = mapRef.current;
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapContainer.current == null) {
      return;
    }

    if (mapRef.current != null || isLoadingRef.current) {
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

    let map: MapboxMap | MaplibreMap;
    if (baseMapProviderId === BaseMapProviderId.mapbox2) {
      map = new MapboxMap(mapOptions);
    } else {
      map = new MaplibreMap(mapOptions);
    }
    isLoadingRef.current = true;

    map.on('style.load', () => {
      mapRef.current = map;
    });

    map.on('move', () => {
      const center = map.getCenter();
      dispatch(
        mapActions.setMapState({
          longitude: center.lng,
          latitude: center.lat,
          zoom: map.getZoom(),
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
  ]);

  return mapRef;
};

export default useMapboxHook;
