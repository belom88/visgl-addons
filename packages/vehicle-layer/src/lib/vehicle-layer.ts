import { CompositeLayer, Layer, LayersList } from '@deck.gl/core/typed';
import {
  ScenegraphLayer,
  ScenegraphLayerProps,
} from '@deck.gl/mesh-layers/typed';

type VehicleLayerProps<TProps> = ScenegraphLayerProps<TProps>;

export class VehicleLayer<TProps> extends CompositeLayer<
  VehicleLayerProps<TProps>
> {
  override renderLayers(): Layer<object> | LayersList | null {
    return [new ScenegraphLayer({
      id: `${this.props.id}-scenegraph`,
      data: this.props.data,
      getPosition: this.props.getPosition,
      getOrientation: this.props.getOrientation,
      getColor: this.props.getColor,
      scenegraph:
        'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/models/transit-bus-low-poly-2.glb',
      _lighting: 'pbr',
      updateTriggers: {
        ...this.props.updateTriggers,
      },
    })];
  }
}

VehicleLayer.defaultProps = {
  ...ScenegraphLayer.defaultProps,
};

VehicleLayer.layerName = 'VehicleLayer';
