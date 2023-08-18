import {
  LAYER_PROPS_FEATURE_KEY,
  layerPropsActions,
  layerPropsReducer,
  selectVehiclesCountValue,
} from './layer-props.slice';
import { createStoreWith } from '../../utils/test-utils';
import { UseCaseId } from '../../types';
import { SizeMode } from '@belom88/vehicle-layer';

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

describe('layerProps reducer', () => {
  it('should handle initial state', () => {
    expect(layerPropsReducer(undefined, { type: '' })).toEqual({
      useCase: UseCaseId.SF_TRANSIT,
      vehiclesCountValue: 2000,
      vehiclesCountMinMax: [10, 10000],
      animated: true,
      pickable: false,
      terrain: false,
      size: 20,
      sizeMode: 0,
      scale: 1,
      dimensionMode: '3D',
    });
  });

  it('should handle setVehiclesCount', () => {
    const state = layerPropsReducer(
      undefined,
      layerPropsActions.setVehiclesCount(5001)
    );

    expect(state).toEqual(
      expect.objectContaining({
        vehiclesCountValue: 5001,
        animated: true,
        pickable: false,
        terrain: false,
        scale: 1,
        vehiclesCountMinMax: [10, 10000],
        dimensionMode: '3D',
      })
    );
  });

  it('should selectVehiclesCount', () => {
    const store = createStoreWith({
      [LAYER_PROPS_FEATURE_KEY]: {
        useCase: UseCaseId.SF_TRANSIT,
        vehiclesCountValue: 5005,
        vehiclesCountMinMax: [100, 1000],
        animated: true,
        pickable: false,
        terrain: false,
        sizeMode: SizeMode.Original,
        size: 20,
        scale: 1,
        dimensionMode: '3D',
      },
    });

    const vehiclesCount = selectVehiclesCountValue(store.getState());

    expect(vehiclesCount).toEqual(5005);
  });
});
