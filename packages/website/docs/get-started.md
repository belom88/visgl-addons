---
sidebar_position: 2
---

# Get started

## Installation

Deck.gl is also has dependencies:

```bash
npm install @loaders.gl/core @luma.gl/core
```

Install deck.gl:

```bash
npm install @deck.gl/core @deck.gl/layers @deck.gl/mesh-layers
```

Install VehicleLayer:

```bash
npm install @belom88/vehicle-layer
```

## Create a deck.gl instance

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

## Live example

See full example on [StackBlitz](https://stackblitz.com/edit/js-vr6kev?file=index.js)