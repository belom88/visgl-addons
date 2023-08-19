import { Map as MaplibreMap } from 'maplibre-gl';
import mapboxgl, { LngLatLike, Map as MapboxMap } from 'mapbox-gl';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectMapState } from '../../redux/slices/map.slice';
import { BaseMapProviderId } from '../../constants/base-map-providers';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

export const useMapbox = (
  mapContainer: MutableRefObject<null | HTMLDivElement>,
  baseMapProviderId?: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2,
  mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
): MaplibreMap | MapboxMap | null => {
  const [map, setMap] = useState<MaplibreMap | MapboxMap | null>(null);
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
    if (!map) {
      return;
    }
    map.setCenter([longitude, latitude]);
    map.setZoom(zoom);
    map.setPitch(pitch);
    map.setBearing(bearing);
  }, [longitude, latitude, zoom, pitch, bearing, map]);

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
      newMap.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
      setMap(newMap);
    });
  }, [
    mapContainer,
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
