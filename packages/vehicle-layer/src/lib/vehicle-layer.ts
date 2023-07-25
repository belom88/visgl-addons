import { CompositeLayer, Layer, LayersList } from '@deck.gl/core/typed';
import {
  ScenegraphLayer,
  ScenegraphLayerProps,
} from '@deck.gl/mesh-layers/typed';
import { ScatterplotLayer, ScatterplotLayerProps } from '@deck.gl/layers/typed';
import { DimentionalMode } from '../types';

type VehicleLayerProps<TProps> = ScenegraphLayerProps<TProps> &
  ScatterplotLayerProps<TProps> & {
    /** The layers can work in 2D (Icon arrows) and 3D (Mesh objects) */
    dimentionalMode: DimentionalMode;
  };

export class VehicleLayer<TProps> extends CompositeLayer<
  VehicleLayerProps<TProps>
> {
  static override defaultProps = {
    ...ScatterplotLayer.defaultProps,
    ...ScenegraphLayer.defaultProps,
    dimentionalMode: '3D'
  };

  override renderLayers(): Layer<object> | LayersList | null {
    if (this.props.dimentionalMode === '3D') {
      return [
        new ScenegraphLayer({
          id: `${this.props.id}-scenegraph`,
          data: this.props.data,
          getPosition: this.props.getPosition,
          getOrientation: this.props.getOrientation,
          getColor: this.props.getColor,
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
        new ScatterplotLayer({
          id: `${this.props.id}-scatterplot-layer`,
          data: this.props.data,
          opacity: 1,
          filled: true,
          radiusMinPixels: 1,
          getPosition: this.props.getPosition,
          getRadius: (this.props.sizeScale || 1),
          getFillColor: [0, 105, 92],
        }),
      ];
    }
  }
}

VehicleLayer.layerName = 'VehicleLayer';
