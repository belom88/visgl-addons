import {
  LAYER_PROPS_FEATURE_KEY,
  layerPropsActions,
  layerPropsReducer,
  selectVehiclesCount,
} from './layer-props.slice';
import { createStoreWith } from '../../utils/test-utils';

describe('layerProps reducer', () => {
  it('should handle initial state', () => {
    expect(layerPropsReducer(undefined, { type: '' })).toEqual({
      vehiclesCount: 2000,
    });
  });

  it('should handle setVehiclesCount', () => {
    const state = layerPropsReducer(
      undefined,
      layerPropsActions.setVehiclesCount(5001)
    );

    expect(state).toEqual(
      expect.objectContaining({
        vehiclesCount: 5001,
      })
    );
  });

  it('should selectVehiclesCount', () => {
    const store = createStoreWith({
      [LAYER_PROPS_FEATURE_KEY]: { vehiclesCount: 5005 },
    });

    const vehiclesCount = selectVehiclesCount(store.getState());

    expect(vehiclesCount).toEqual(5005);
  });
});
