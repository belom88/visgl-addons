---
sidebar_position: 4
---

# Scripting Bundle

Deck.gl offers a standalone bundled version of the library - a native JavaScript scripting interface like that of d3.js. VehicleLayer has respective scripting bundle version of the library. To use it `scripting-bundle.js` should be included to the web page:

```html
<script src="https://unpkg.com/@belom88/vehicle-layer@0.1.7/scripting-bundle.js"></script>
```

## Full example

```html
<html>
  <head>
    <!-- deck.gl standalone bundle -->
    <script src="https://unpkg.com/deck.gl@^8.9.0/dist.min.js"></script>
    <script src="https://unpkg.com/@belom88/vehicle-layer@0.1.7/scripting-bundle.js"></script>

    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
      }
      #container {
        width: 100vw;
        height: 100vh;
      }
    </style>
  </head>

  <body>
    <div id="container"></div>
  </body>

  <script type="text/javascript">
    const deckgl = new deck.DeckGL({
      container: 'container',

      initialViewState: {
        latitude: 53.431798446246546,
        longitude: -2.957781323439993,
        zoom: 20,
        bearing: 90,
        pitch: 60,
      },
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
          sizeScale: 1,
          dimensionMode: '3D',
          getColor: [238, 255, 203],
          getPosition: (vehicle) => [vehicle.longitude, vehicle.latitude],
          getBearing: (vehicle) => vehicle.bearing,
          getVehicleType: (vehicle) => vehicle.vehilceType,
        }),
      ],
    });
  </script>
</html>
```

## Live example

See full example on [codepen](https://codepen.io/belom88/pen/VwVNYwb)
