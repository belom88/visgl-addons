import {
  LAYER_PROPS_FEATURE_KEY,
  layerPropsActions,
  layerPropsReducer,
  selectVehiclesCountValue,
} from './layer-props.slice';
import { createStoreWith } from '../../utils/test-utils';

describe('layerProps reducer', () => {
  it('should handle initial state', () => {
    expect(layerPropsReducer(undefined, { type: '' })).toEqual({
      vehiclesCountValue: 2000,
      vehiclesCountMinMax: [10, 10000],
      animated: true,
      scale: 1,
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
        scale: 1,
        vehiclesCountMinMax: [10, 10000],
      })
    );
  });

  it('should selectVehiclesCount', () => {
    const store = createStoreWith({
      [LAYER_PROPS_FEATURE_KEY]: {
        vehiclesCountValue: 5005,
        vehiclesCountMinMax: [100, 1000],
        animated: true,
        scale: 1,
      },
    });

    const vehiclesCount = selectVehiclesCountValue(store.getState());

    expect(vehiclesCount).toEqual(5005);
  });
});
