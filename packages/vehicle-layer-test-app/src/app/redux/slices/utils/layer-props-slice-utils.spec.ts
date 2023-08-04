import { UseCaseId } from '../../../types';
import { LayerPropsState } from '../layer-props.slice';
import { setAnimation } from './layer-props-slice-utils';

describe('layer-props reduces / utils', () => {
  it('calculateCurrentFps', () => {
    const state: LayerPropsState = {
      useCase: UseCaseId.SF_TRANSIT,
      vehiclesCountValue: 2000,
      vehiclesCountMinMax: [10, 10000],
      animated: true,
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
