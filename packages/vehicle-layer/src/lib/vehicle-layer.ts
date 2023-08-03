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
import { DimensionMode, VehicleType } from '../types';

const VEHILCE_TYPE_URLS = {
  [VehicleType.TransitBus]: {
    model:
      'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/models/transit-bus-low-poly-2.glb',
    icon: 'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/icons/bus.svg',
  },
  [VehicleType.Tram]: {
    model:
      'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/models/tram-low-poly-1.glb',
    icon: 'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/icons/tram.svg',
  },
};

type VehicleLayerProps<TProps> = ScenegraphLayerProps<TProps> &
  IconLayerProps<TProps> & {
    data: TProps[];
    /** The layers can work in 2D (Icon arrows) and 3D (Mesh objects) */
    dimensionMode: DimensionMode;
    getBearing: Accessor<TProps, number>;
    getColor: Accessor<TProps, Color>;
    get3dColor: Accessor<TProps, Color>;
    get2dBackgroundColor: Accessor<TProps, Color>;
    get2dForegroundColor: Accessor<TProps, Color>;
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
    getColor: undefined,
    get3dColor: undefined,
    get2dBackgroundColor: [255, 255, 255, 255],
    get2dForegroundColor: undefined,
    getBearing: undefined,
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
  ): ScenegraphLayer {
    return new ScenegraphLayer({
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
      sizeScale: this.props.sizeScale,
      scenegraph: VEHILCE_TYPE_URLS[vehicleType].model,
      _lighting: 'pbr',
      updateTriggers: {
        ...this.props.updateTriggers,
      },
    });
  }

  private getVehicleTypeIconLayer(
    vehicleType: VehicleType,
    data: TProps[]
  ): IconLayer {
    return new IconLayer({
      id: `${this.props.id}-vehilce-icon-${vehicleType}`,
      data,
      getPosition: this.props.getPosition,
      getSize: this.props.sizeScale || 1,
      sizeScale: 0.4,
      sizeUnits: 'meters',
      iconAtlas: VEHILCE_TYPE_URLS[vehicleType].icon,
      getIcon: () => 'arrow',
      getColor: this.props.get2dBackgroundColor || [255, 255, 255, 255],
      getAngle: () => {
        const viewport = this.context.viewport as WebMercatorViewport;
        const bearing = viewport.bearing;
        return Number.isFinite(bearing) ? -bearing : 0;
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
    });
  }

  private get2DArrowLayers(): IconLayer[] {
    return [
      new IconLayer({
        id: `${this.props.id}--arrow-icon-background`,
        data: this.props.data,
        getPosition: this.props.getPosition,
        getSize: this.props.sizeScale || 1,
        sizeUnits: 'meters',
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
      }),
      new IconLayer({
        id: `${this.props.id}-arrow-icon-foreground`,
        data: this.props.data,
        getPosition: this.props.getPosition,
        getSize: this.props.sizeScale || 1,
        sizeUnits: 'meters',
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
      }),
    ];
  }

  override renderLayers(): Layer<object> | LayersList | null {
    let layers: (ScenegraphLayer | IconLayer)[] = [];
    if (this.props.dimensionMode === '2D') {
      layers = this.get2DArrowLayers();
    }

    let getLayerCallback: (
      vehicleType: VehicleType,
      data: TProps[]
    ) => ScenegraphLayer | IconLayer;
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
        layers.push(getLayerCallback(parseInt(vehicleType), filteredData));
      }
    } else {
      const vehileType = Number.isFinite(this.props.getVehicleType)
        ? this.props.getVehicleType
        : VehicleType.TransitBus;
      layers.push(getLayerCallback(vehileType, this.props.data));
    }
    return layers;
  }
}

VehicleLayer.layerName = 'VehicleLayer';
