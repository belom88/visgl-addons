import { Map } from 'maplibre-gl';
import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { mapActions, selectMapState } from '../../redux/slices/map.slice';

export const useMaplibreHook = (
  mapContainer: MutableRefObject<null | HTMLDivElement>
): RefObject<Map | null> => {
  const mapRef = useRef<Map | null>(null);
  const dispatch = useAppDispatch();
  const { longitude, latitude, zoom, pitch, bearing } =
    useAppSelector(selectMapState);

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

    if (mapRef.current != null) {
      return; // initialize map only once
    }
    const map = new Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [longitude, latitude],
      zoom,
      pitch,
      bearing,
    });

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
  }, [mapContainer, dispatch, longitude, latitude, zoom, bearing, pitch]);

  return mapRef;
};

export default useMaplibreHook;
