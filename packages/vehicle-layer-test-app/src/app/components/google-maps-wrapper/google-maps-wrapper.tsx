import { useState, useEffect, useMemo } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps/typed';
import { AnimatedVehicle } from '../../utils/vehicles-utils';
import { StyledMapContainer } from '../common-styled';
import { useAppSelector } from '../../redux/hooks';
import { selectMapState } from '../../redux/slices/map.slice';
import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';

const googleMapsApiToken = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/* eslint-disable-next-line */
export interface GoogleMapsWrapperProps {
  vehicles: AnimatedVehicle[];
  mapId?: string;
}

const renderMap = (status: Status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return <h3>{status} .</h3>;
};

export function GoogleMapsWrapper({ vehicles, mapId }: GoogleMapsWrapperProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const { longitude, latitude, zoom, pitch, bearing } =
    useAppSelector(selectMapState);

  const overlay = useMemo(
    () =>
      new DeckOverlay({
        layers: [],
      }),
    []
  );

  useEffect(() => {
    const layer = new VehicleLayer<AnimatedVehicle>({
      id: 'transit-model-vehicle-layer',
      data: vehicles,
      getPosition: (vehicle: AnimatedVehicle) => [
        vehicle.longitude,
        vehicle.latitude,
      ],
      getOrientation: (vehicle: AnimatedVehicle) => [
        0,
        -vehicle.bearing + 90,
        90,
      ],
    });
    overlay.setProps({
      layers: [layer],
    });
  }, [vehicles, overlay]);

  useEffect(() => {
    if (map) {
      map.setCenter({ lat: latitude, lng: longitude });
      map.setZoom(zoom);
      map.setHeading(bearing);
      map.setTilt(pitch);
      overlay.setMap(map);
    }
  }, [map, latitude, longitude, bearing, pitch, zoom, overlay]);

  useEffect(() => {
    if (!mapContainer) {
      return;
    }
    const mapInstance = new google.maps.Map(mapContainer, {
      mapId,
    });
    setMap(mapInstance);
  }, [mapId, mapContainer]);

  const setRef = (element: HTMLDivElement) => {
    setMapContainer(element);
  };

  return (
    <Wrapper apiKey={googleMapsApiToken} render={renderMap}>
      <StyledMapContainer
        ref={setRef}
        id="map"
      />
    </Wrapper>
  );
}

export const createGoogleMapWith = (mapId: string) => {
  return (props: GoogleMapsWrapperProps) => (
    <GoogleMapsWrapper {...props} mapId={mapId} />
  );
};

export default GoogleMapsWrapper;
