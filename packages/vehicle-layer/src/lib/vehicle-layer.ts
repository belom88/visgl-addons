import { CompositeLayer, Layer, LayersList } from '@deck.gl/core/typed';
import {
  ScenegraphLayer,
  ScenegraphLayerProps,
} from '@deck.gl/mesh-layers/typed';

type VehicleLayerProps<TProps> = ScenegraphLayerProps<TProps>;

export class VehicleLayer<TProps> extends CompositeLayer<VehicleLayerProps<TProps>> {
  override renderLayers(): Layer<object> | LayersList | null {
    return new ScenegraphLayer({
      ...this.props,
      scenegraph: 'https://raw.githubusercontent.com/belom88/visgl/main/packages/vehicle-layer/models/transit-bus-low-poly-2.glb',
      _lighting: 'pbr',
    });
  }
}

VehicleLayer.defaultProps = {
  ...ScenegraphLayer.defaultProps,
};

VehicleLayer.layerName = 'VehicleLayer';
