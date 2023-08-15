import {
  Accessor,
  AccessorContext,
  Color,
  CompositeLayer,
  Layer,
  LayersList,
  WebMercatorViewport,
} from '@deck.gl/core/typed';
import {
  ScenegraphLayer,
  ScenegraphLayerProps,
} from '@deck.gl/mesh-layers/typed';
import { IconLayer, IconLayerProps } from '@deck.gl/layers/typed';
import { DimensionMode, SizeMode, VehicleType } from '../types';

const VEHILCE_TYPE_URLS = {
  [VehicleType.TransitBus]: {
    model:
      'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/models/scaled/scaled-transit-bus-low-poly-2.glb',
    icon: 'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/icons/bus.svg',
  },
  [VehicleType.Tram]: {
    model:
      'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/models/scaled/scaled-tram-low-poly-1.glb',
    icon: 'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/icons/tram.svg',
  },
};

/** Vehicle width in meters */
const VEHICLE_WIDTH = 5;
/** TransitBus volume size in meters */
const TRANSIT_BUS_VOLUME_SIZE = 10.5;

type VehicleLayerProps<TProps> = ScenegraphLayerProps<TProps> &
  IconLayerProps<TProps> & {
    /** Array of vehicles objects. Vehicle object must containt position information. */
    data: TProps[];
    /** In `2D` mode vehicles are shown as arrow icons. In `3D` mode vehicles are shown as 3D models. */
    dimensionMode: DimensionMode;
    /** A way to define vehicles size */
    sizeMode: SizeMode;
    /** Size in pixels for pixel size mode */
    size: number;
    /** For 3D - scale multiplier for all dimensions. For 2D - icon size (in meters) multiplied.  */
    sizeScale: number;
    /** deck.gl accessor that transforms vehicle data to the movement direction of the vehicle. */
    getBearing: Accessor<TProps, number>;
    /** deck.gl accessor that transforms vehicle data to the vehicle color. */
    getColor: Accessor<TProps, Color>;
    /** deck.gl accessor that transforms vehicle data to the color of 3D model. This accessor overrides `getColor` accessor. */
    get3dColor: Accessor<TProps, Color>;
    /** deck.gl accessor that transforms vehicle data to the background color of 2D icon. */
    get2dBackgroundColor: Accessor<TProps, Color>;
    /** deck.gl accessor that transforms vehicle data to the foreground color of 2D icon. This accessor overrides `getColor` accessor. */
    get2dForegroundColor: Accessor<TProps, Color>;
    /** deck.gl accessor that transforms vehicle data to a vehicle type. */
    getVehicleType: Accessor<TProps, VehicleType>;
  };

export class VehicleLayer<TProps> extends CompositeLayer<
  VehicleLayerProps<TProps>
> {
  static override defaultProps = {
    ...IconLayer.defaultProps,
    ...ScenegraphLayer.defaultProps,
    data: [],
    dimentionalMode: '3D',
    sizeMode: SizeMode.Original,
    size: 20,
    sizeScale: 1,
    getColor: undefined,
    get3dColor: undefined,
    get2dBackgroundColor: [255, 255, 255, 255],
    get2dForegroundColor: undefined,
    getBearing: 0,
    getVehicleType: undefined,
  };

  private calculateBearing(
    vehicle: TProps,
    objectInfo: AccessorContext<TProps>
  ): number {
    let bearing = 0;
    if (this.props.getBearing instanceof Function) {
      bearing = this.props.getBearing(vehicle, objectInfo);
    } else if (Array.isArray(this.props.getOrientation)) {
      bearing = this.props.getBearing;
    }
    return bearing;
  }

  private getVehicleTypeScenegraphLayer(
    vehicleType: VehicleType,
    data: TProps[]
  ): ScenegraphLayer | null {
    let sizeScale = this.props.sizeScale;
    if (this.props.sizeMode === SizeMode.Pixel) {
      const viewport = this.context.viewport as WebMercatorViewport;
      const centralPixel = viewport.project([
        viewport.longitude,
        viewport.latitude,
      ]);
      const nextPixel = viewport.project(
        viewport.addMetersToLngLat(
          [viewport.longitude, viewport.latitude],
          [1, 0]
        )
      );
      const meterPixelSize = Math.sqrt(
        (centralPixel[0] - nextPixel[0]) ** 2 +
          (centralPixel[1] - nextPixel[1]) ** 2
      );
      // 1m : meterPixelSize
      // TRANSIT_BUS_VOLUME_SIZE : this.props.size
      sizeScale = this.props.size / TRANSIT_BUS_VOLUME_SIZE / meterPixelSize;
    }

    return new ScenegraphLayer({
      ...this.props,
      id: `${this.props.id}-scenegraph-${vehicleType}`,
      data,
      getPosition: this.props.getPosition,
      getOrientation: (
        vehicle: TProps,
        objectInfo: AccessorContext<TProps>
      ) => {
        const bearing = this.calculateBearing(vehicle, objectInfo);
        return [0, -bearing + 90, 0];
      },
      getColor: this.props.get3dColor ||
        this.props.getColor || [255, 255, 255, 255],
      sizeScale,
      scenegraph: VEHILCE_TYPE_URLS[vehicleType].model,
      _lighting: 'pbr',
      updateTriggers: {
        ...this.props.updateTriggers,
      },
    });
  }

  private getVehicleTypeIconLayer(
    vehicleType: VehicleType,
    data: TProps[],
    viewportBearing: number
  ): IconLayer {
    return new IconLayer({
      ...this.props,
      id: `${this.props.id}-vehilce-icon-${vehicleType}`,
      data,
      getPosition: this.props.getPosition,
      getSize:
        this.props.sizeMode === SizeMode.Original
          ? (this.props.sizeScale || 1) * VEHICLE_WIDTH
          : this.props.size,
      sizeScale: 0.4,
      sizeUnits:
        this.props.sizeMode === SizeMode.Original ? 'meters' : 'pixels',
      iconAtlas: VEHILCE_TYPE_URLS[vehicleType].icon,
      getIcon: () => 'arrow',
      getColor: this.props.get2dBackgroundColor || [255, 255, 255, 255],
      getAngle: () => {
        return Number.isFinite(viewportBearing) ? -viewportBearing : 0;
      },
      iconMapping: {
        arrow: {
          x: 0,
          y: 0,
          width: 800,
          height: 800,
          mask: true,
        },
      },
      billboard: false,
      updateTriggers: {
        ...this.props.updateTriggers,
        getAngle: [viewportBearing],
      },
    });
  }

  private get2DArrowLayers(): IconLayer[] {
    return [
      new IconLayer({
        ...this.props,
        id: `${this.props.id}--arrow-icon-background`,
        data: this.props.data,
        getPosition: this.props.getPosition,
        getSize:
          this.props.sizeMode === SizeMode.Original
            ? (this.props.sizeScale || 1) * VEHICLE_WIDTH
            : this.props.size,
        sizeUnits:
          this.props.sizeMode === SizeMode.Original ? 'meters' : 'pixels',
        iconAtlas:
          'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/icons/arrow-background.svg',
        getIcon: () => 'arrow',
        getColor: this.props.get2dBackgroundColor || [255, 255, 255, 255],
        getAngle: (vehicle: TProps, objectInfo: AccessorContext<TProps>) => {
          const bearing = this.calculateBearing(vehicle, objectInfo);
          return -bearing + 45;
        },
        iconMapping: {
          arrow: {
            x: 0,
            y: 0,
            width: 500,
            height: 500,
            mask: true,
          },
        },
        billboard: false,
        updateTriggers: {
          ...this.props.updateTriggers,
        },
      }),
      new IconLayer({
        ...this.props,
        id: `${this.props.id}-arrow-icon-foreground`,
        data: this.props.data,
        getPosition: this.props.getPosition,
        getSize:
          this.props.sizeMode === SizeMode.Original
            ? (this.props.sizeScale || 1) * VEHICLE_WIDTH
            : this.props.size,
        sizeUnits:
          this.props.sizeMode === SizeMode.Original ? 'meters' : 'pixels',
        iconAtlas:
          'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/icons/arrow-front.svg',
        getIcon: () => 'arrow',
        getColor: this.props.get2dForegroundColor ||
          this.props.getColor || [0, 0, 0, 255],
        getAngle: (vehicle: TProps, objectInfo: AccessorContext<TProps>) => {
          const bearing = this.calculateBearing(vehicle, objectInfo);
          return -bearing + 45;
        },
        iconMapping: {
          arrow: {
            x: 0,
            y: 0,
            width: 500,
            height: 500,
            mask: true,
          },
        },
        billboard: false,
        updateTriggers: {
          ...this.props.updateTriggers,
        },
      }),
    ];
  }

  override renderLayers(): Layer<object> | LayersList | null {
    let layers: (ScenegraphLayer | IconLayer | null)[] = [];
    if (this.props.dimensionMode === '2D') {
      layers = this.get2DArrowLayers();
    }

    const viewport = this.context.viewport as WebMercatorViewport;
    const viewportBearing = viewport.bearing;

    let getLayerCallback: (
      vehicleType: VehicleType,
      data: TProps[],
      viewportBearing: number
    ) => ScenegraphLayer | IconLayer | null;
    if (this.props.dimensionMode === '3D') {
      getLayerCallback = this.getVehicleTypeScenegraphLayer.bind(this);
    } else {
      getLayerCallback = this.getVehicleTypeIconLayer.bind(this);
    }

    if (this.props.getVehicleType instanceof Function) {
      for (const vehicleType in VEHILCE_TYPE_URLS) {
        const filteredData = this.props.data.filter(
          (vehicle: TProps) =>
            // @ts-expect-error we are sure that getVehicleType is function
            parseInt(vehicleType) === this.props.getVehicleType(vehicle)
        );
        layers.push(
          getLayerCallback(parseInt(vehicleType), filteredData, viewportBearing)
        );
      }
    } else {
      const vehileType = Number.isFinite(this.props.getVehicleType)
        ? this.props.getVehicleType
        : VehicleType.TransitBus;
      layers.push(
        getLayerCallback(vehileType, this.props.data, viewportBearing)
      );
    }
    return layers;
  }
}

VehicleLayer.layerName = 'VehicleLayer';
