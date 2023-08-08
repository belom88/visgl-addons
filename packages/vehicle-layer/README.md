# VehicleLayer

Visualize transit vehicles on a map easily.

VehicleLayer package is a deck.gl layer. It is developed to visualize different vehicle types, for instance, transit buses and trams. The layer can visualize vehicles in 2D or 3D modes.

![Demo image](https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/images/demo.png)

## Short example

```javascript
import { Deck } from '@deck.gl/core';
import { VehicleLayer, VehicleType } from '@belom88/vehicle-layer';

const INITIAL_VIEW_STATE = {
  latitude: 53.431798446246546,
  longitude: -2.957781323439993,
  zoom: 20,
};

const deckgl = new Deck({
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: [
    new VehicleLayer({
      id: 'vehicle-layer',
      data: [
        {
          latitude: 53.43185529968051,
          longitude: -2.9577037905967574,
          bearing: -51.94099460927194,
          vehilceType: VehicleType.TransitBus,
        },
        {
          latitude: 53.431755073582494,
          longitude: -2.9578708705967136,
          bearing: -51.94099460927194,
          vehilceType: VehicleType.Tram,
        },
      ],
      dimensionMode: '3D',
      getColor: [238, 255, 203],
      getPosition: (vehicle) => [vehicle.longitude, vehicle.latitude],
      getBearing: (vehicle) => vehicle.bearing,
      getVehicleType: (vehicle) => vehicle.vehilceType,
    }),
  ],
});
```

## Requirements

- Web-browser with WebGL API support(see https://caniuse.com/webgl)

## Dependencies

- [@deck.gl/core](https://www.npmjs.com/package/@deck.gl/core)
- [@deck.gl/layers](https://www.npmjs.com/package/@deck.gl/layers)
- [@deck.gl/mesh-layers](https://www.npmjs.com/package/@deck.gl/mesh-layers)

## Versions compatibility

The compatibility table mentions deck.gl version that was used to build the specific version of VehicleLayer. However the specific version of VehicleLayer might be compatible with other deck.gl versions although not tested with.

| VehicleLayer | built on deck.gl |
| ------------ | ---------------- |
| 0.0.X        | ^8.9.21          |

## Vehicle types

Vehicle type is a number that encodes a type of vehicle. `VehicleType` enum can be imported to define vehicle types in a human readable way.

| VehicleType | Code |
| ----------- | ---- |
| TransitBus  | 0    |
| Tram        | 1    |

## Properties

### data

_type_: `T[]` where T is a Vehicle object type;

_default_: []

_description_: Array of vehicles objects. Vehicle object must containt position information.

### dimensionMode

_type_: '2D' or '3D'

_default_: '3D'

_description_: In `2D` mode vehicles are shown as arrow icons. In `3D` mode vehicles are shown as 3D models.

### sizeScale

_type_: number

_default_: 1

_description_: For 3D - scale multiplier for all dimensions. For 2D - icon size (in meters) multiplied by 5.

### getBearing

_type_: Accessor<TProps, number>

_default_: 0

_description_: deck.gl accessor that transforms vehicle data to the movement direction of the vehicle.

### getColor

_type_: Accessor<TProps, Color>

_default_: [255, 255, 255]

_description_: deck.gl accessor that transforms vehicle data to the vehicle color.

### get3dColor

_type_: Accessor<TProps, Color>

_default_: undefined

_description_: deck.gl accessor that transforms vehicle data to the color of 3D model. This accessor overrides `getColor` accessor.

### get2dBackgroundColor

_type_: Accessor<TProps, Color>

_default_: [255, 255, 255]

_description_: deck.gl accessor that transforms vehicle data to the background color of 2D icon.

### get2dForegroundColor

_type_: Accessor<TProps, Color>

_default_: [0, 0, 0]

_description_: deck.gl accessor that transforms vehicle data to the foreground color of 2D icon. This accessor overrides `getColor` accessor.

### getVehicleType

_type_: Accessor<TProps, VehicleType>

_default_: VehicleType.TransitBus

_description_: deck.gl accessor that transforms vehicle data to a vehicle type.
