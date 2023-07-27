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
import { DimentionalMode } from '../types';

type VehicleLayerProps<TProps> = ScenegraphLayerProps<TProps> &
  IconLayerProps<TProps> & {
    /** The layers can work in 2D (Icon arrows) and 3D (Mesh objects) */
    dimentionalMode: DimentionalMode;
    getBearing: Accessor<TProps, number>;
    getColor: Accessor<TProps, Color>;
    get3dColor: Accessor<TProps, Color>;
    get2dBackgroundColor: Accessor<TProps, Color>;
    get2dFrontColor: Accessor<TProps, Color>;
  };

export class VehicleLayer<TProps> extends CompositeLayer<
  VehicleLayerProps<TProps>
> {
  static override defaultProps = {
    ...IconLayer.defaultProps,
    ...ScenegraphLayer.defaultProps,
    dimentionalMode: '3D',
    getColor: undefined,
    get3dColor: undefined,
    get2dBackgroundColor: [255, 255, 255, 255],
    get2dFrontColor: undefined,
    getBearing: undefined,
  };

  private calculateBearing(
    vehicle: TProps,
    objectInfo: AccessorContext<TProps>
  ): number {
    let bearing = 0;
    if (typeof this.props.getBearing === 'function') {
      bearing = this.props.getBearing(vehicle, objectInfo);
    } else if (Array.isArray(this.props.getOrientation)) {
      bearing = this.props.getBearing;
    }
    return bearing;
  }

  override renderLayers(): Layer<object> | LayersList | null {
    if (this.props.dimentionalMode === '3D') {
      return [
        new ScenegraphLayer({
          id: `${this.props.id}-scenegraph`,
          data: this.props.data,
          getPosition: this.props.getPosition,
          getOrientation: (
            vehicle: TProps,
            objectInfo: AccessorContext<TProps>
          ) => {
            const bearing = this.calculateBearing(vehicle, objectInfo);
            return [0, -bearing + 90, 90];
          },
          getColor: this.props.get3dColor ||
            this.props.getColor || [255, 255, 255, 255],
          sizeScale: this.props.sizeScale,
          scenegraph:
            'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/models/transit-bus-low-poly-2.glb',
          _lighting: 'pbr',
          updateTriggers: {
            ...this.props.updateTriggers,
          },
        }),
      ];
    } else {
      return [
        new IconLayer({
          id: `${this.props.id}--arrow-icon-background`,
          data: this.props.data,
          getPosition: this.props.getPosition,
          getSize: (this.props.sizeScale || 1) * 5,
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
          id: `${this.props.id}-arrow-icon-front`,
          data: this.props.data,
          getPosition: this.props.getPosition,
          getSize: (this.props.sizeScale || 1) * 5,
          sizeUnits: 'meters',
          iconAtlas:
            'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/icons/arrow-front.svg',
          getIcon: () => 'arrow',
          getColor: this.props.get2dFrontColor ||
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
        new IconLayer({
          id: `${this.props.id}--arrow-icon-background`,
          data: this.props.data,
          getPosition: this.props.getPosition,
          getSize: (this.props.sizeScale || 1) * 5,
          sizeScale: 0.4,
          sizeUnits: 'meters',
          iconAtlas:
            'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/icons/bus.svg',
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
        }),
      ];
    }
  }
}

VehicleLayer.layerName = 'VehicleLayer';
