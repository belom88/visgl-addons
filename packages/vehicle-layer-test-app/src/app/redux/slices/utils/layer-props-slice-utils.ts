import type { LayerPropsState } from '../layer-props.slice';

export const setAnimation = (state: LayerPropsState, value: boolean) => {
  state.animated = value;
  if (state.animated) {
    state.vehiclesCountValue = 2000;
    state.vehiclesCountMinMax = [10, 10000];
  } else {
    state.vehiclesCountMinMax = [1000, 100000];
    state.vehiclesCountValue = 10000;
  }
};
