import { useState, useEffect, useMemo } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps/typed';
import { AnimatedVehicle } from '../../utils/vehicles-utils';
import { StyledMapContainer } from '../common-styled';
import { useAppSelector } from '../../redux/hooks';
import { selectMapState } from '../../redux/slices/map.slice';
import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';

const googleMapsApiToken = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const googleMapsMapId = import.meta.env.VITE_GOOGLE_MAP_VECTOR_ID;

/* eslint-disable-next-line */
export interface GoogleMapsWrapperProps {
  vehicles: AnimatedVehicle[];
  interleaved?: boolean;
}

const renderMap = (status: Status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return <h3>{status} .</h3>;
};

export function GoogleMapsWrapper({
  vehicles,
  interleaved = false,
}: GoogleMapsWrapperProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const { longitude, latitude, zoom, pitch, bearing } =
    useAppSelector(selectMapState);

  const overlay = useMemo(
    () =>
      new DeckOverlay({
        interleaved,
        layers: [],
      }),
    [interleaved]
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
      mapId: googleMapsMapId,
    });
    setMap(mapInstance);
  }, [mapContainer]);

  const setRef = (element: HTMLDivElement) => {
    setMapContainer(element);
  };

  return (
    <Wrapper apiKey={googleMapsApiToken} render={renderMap}>
      <StyledMapContainer ref={setRef} id="map" />
    </Wrapper>
  );
}

export const createGoogleMapWith = (interleaved: boolean) => {
  return (props: GoogleMapsWrapperProps) => (
    <GoogleMapsWrapper {...props} interleaved={interleaved} />
  );
};

export default GoogleMapsWrapper;
