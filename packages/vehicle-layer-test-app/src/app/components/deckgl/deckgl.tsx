import { DeckGL } from "@deck.gl/react/typed";
import {Map} from  'react-map-gl/maplibre'; 
import { Vehicle, getPositions } from "../../utils/get-positions";
import {VehicleLayer} from '@belom88/deckgl-vehicle-layer';

/* eslint-disable-next-line */
export interface DeckglProps {}

const INITIAL_VIEWSTATE = {
  latitude: 48.36458,
  longitude: 10.890369,
  zoom: 21,
  maxZoom: 25,
  bearing: 0,
  pitch: 30,
};

const vehicles = getPositions({ ...INITIAL_VIEWSTATE }, 20000);


export function Deckgl(props: DeckglProps) {

  const getLayer = () => new VehicleLayer<Vehicle>({
    id: "transit-model-vehicle-layer",
    data: vehicles,
    getPosition: (vehicle: Vehicle) => [vehicle.longitude, vehicle.latitude],
    getOrientation: (vehicle: Vehicle) => [0, -vehicle.bearing + 90, 90],
    getColor: () => [0, 0, 255],
    _lighting: "pbr",
  });

  return (<DeckGL
    initialViewState={INITIAL_VIEWSTATE}
    controller
    layers={[getLayer()]}
  >
    <Map
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    />
  </DeckGL>
  );
}

export default Deckgl;
