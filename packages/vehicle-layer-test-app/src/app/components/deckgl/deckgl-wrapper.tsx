import { DeckGL } from '@deck.gl/react/typed';
import { Map } from 'react-map-gl/maplibre';
import { AnimatedVehicle } from '../../utils/vehicles-utils';
import { VehicleLayer } from '@belom88/deckgl-vehicle-layer';
import { useAppSelector } from '../../redux/hooks';
import { selectMapState } from '../../redux/slices/map.slice';
import { StyledMapContainer } from '../common-styled';

/* eslint-disable-next-line */
export interface DeckglWrapperProps {
  vehicles: AnimatedVehicle[];
}

export function DeckglWrapper({ vehicles }: DeckglWrapperProps) {
  const viewState = useAppSelector(selectMapState);

  const getLayer = () =>
    new VehicleLayer<AnimatedVehicle>({
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

  return (
    <StyledMapContainer>
      <DeckGL initialViewState={viewState} controller layers={[getLayer()]}>
        <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
      </DeckGL>
    </StyledMapContainer>
  );
}

export default DeckglWrapper;
