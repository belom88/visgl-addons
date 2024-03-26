---
sidebar_position: 1
---

# Introduction

VehicleLayer is a [deck.gl](https://deck.gl/) layer that is intended to be used on 3D or 2D maps.

## deck.gl introduction

deck.gl is a WebGL framework that, in general, used for visualization different types of data on maps. It is developed to work with maps in reactive programming style. One of core concepts of deck.gl is layers system. A layer in deck.gl is an instance of some layer type. There are multiple built-in layers, as in GeoJsonLayer, HeatmapLayer, PointLayer etc.

## VehicleLayer in deck.gl

VehicleLayer is another layer type. It is a composite layer that means it consists of other deck.gl layer types:

- [ScenegraphLayer](https://deck.gl/docs/api-reference/mesh-layers/scenegraph-layer) - for 3D mode visualization;
- [IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer) - for 2D mode visualization.

VehicleLayer creates instances of those built-in layers under the hood to achieve smooth user experience and make another abstraction level. Also it implements some logic inside. For example, in 2D mode VehicleLayer creates at least 3 instances of IconLayer. It allows rotation of internal vehicle icon keeping it always up, colorize background and foreground of the VehicleLayer in 2D mode.

![2D rotation](/img/2d-rotation.gif)

## Vehicle types

When somebody creates data visualizations, performance limitations come. In WebGL, performance is related to amount of vertices needed to render. That means that it is not possible to use high-quality 3D models to visualize thousands objects on a map. The lower quality, the better performance.

One of goals of this layer was creating a list of built-in 3D models that have proven performance parameters. So VehicleLayer has strict vehicle types list. The development plan also includes adding more vehicle types.

![Demo image](https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/images/demo.png)

## Size modes

VehicleLayer provides 2 sizing approaches:

- Original size;
- Pixel size.

### Original size

3D models are made in original size propotions. So the bus is ~10.5 meters, the tram is ~16.5 meters. It is possible to change vehicles size with a scale multiplier. 2D icons are sized to have approximately similar size as in 3D.

![Original size](/img/original-size.gif)

### Pixel size

Pixel size has come from IconLayer because this layer has build-in size units property. VehicleLayer calculates approximate 3D models pixel size and allows to set size of 3D models in the pixel size mode as well.

![Pixel size](/img/pixel-size.gif)
