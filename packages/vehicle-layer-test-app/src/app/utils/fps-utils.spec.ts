import { calculateCurrentFps, updateAverageFps } from './fps-utils';

describe('utils/fps-utils', () => {
  it('calculateCurrentFps', () => {
    const result = calculateCurrentFps(940.842535, 940855.099);
    expect(result).toEqual({
      currentFps: 79.59248646857245,
      newThen: 940.8550990000001,
    });
  });

  it('updateAverageFps', () => {
    const result = updateAverageFps({ value: 55, count: 70 }, 61);
    expect(result).toEqual({ count: 71, value: 55.08450704225352 });
  });
});
