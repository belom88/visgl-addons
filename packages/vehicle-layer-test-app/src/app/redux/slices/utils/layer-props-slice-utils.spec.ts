import { VehicleSizeMode } from '@belom88/vehicle-layer';
import { UseCaseId } from '../../../types';
import { LayerPropsState } from '../layer-props.slice';
import { setAnimation } from './layer-props-slice-utils';

vi.mock('@deck.gl/core', () => {
  const CompositeLayer = vi.fn();
  return { CompositeLayer };
});
vi.mock('@deck.gl/layers', () => {
  const IconLayer = vi.fn();
  const IconLayerProps = {};
  return { IconLayer, IconLayerProps };
});
vi.mock('@deck.gl/mesh-layers', () => {
  const ScenegraphLayer = vi.fn();
  const ScenegraphLayerProps = {};
  return { ScenegraphLayer, ScenegraphLayerProps };
});

describe('layer-props reduces / utils', () => {
  it('setAnimation', () => {
    const state: LayerPropsState = {
      useCase: UseCaseId.SF_TRANSIT,
      vehiclesCountValue: 2000,
      vehiclesCountMinMax: [10, 10000],
      animated: true,
      pickable: false,
      terrain: false,
      size: 20,
      sizeMode: VehicleSizeMode.Pixel,
      scale: 10,
      dimensionMode: '3D',
    };
    setAnimation(state, false);
    expect(state).toEqual(
      expect.objectContaining({
        animated: false,
        vehiclesCountValue: 10000,
        vehiclesCountMinMax: [1000, 100000],
      })
    );
  });
});
