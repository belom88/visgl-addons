import { SizeMode } from '@belom88/vehicle-layer';
import { TEST_CASES } from '../../constants/test-cases';
import { createStoreWith } from '../../utils/test-utils';
import { setTestCase, testCasesReducer } from './test-cases.slice';

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

describe('testCases reducer', () => {
  it('should handle initial state', () => {
    expect(testCasesReducer(undefined, { type: '' })).toEqual({
      selectedTestCase: TEST_CASES[0],
    });
  });

  it('should handle setTestCase', () => {
    const state = testCasesReducer(
      undefined,
      setTestCase.fulfilled(TEST_CASES[1], '', TEST_CASES[1])
    );

    expect(state).toEqual(
      expect.objectContaining({
        selectedTestCase: TEST_CASES[1],
      })
    );
  });

  it('should call setTestCase thunk', async () => {
    const store = createStoreWith({});
    await store.dispatch(setTestCase(TEST_CASES[1]));
    const { testCases, layerProps } = store.getState();
    expect(testCases).toEqual(
      expect.objectContaining({
        selectedTestCase: TEST_CASES[1],
      })
    );
    expect(layerProps).toEqual(
      expect.objectContaining({
        vehiclesCountValue: 5000,
        animated: true,
        sizeMode: SizeMode.Original,
        scale: 1,
        vehiclesCountMinMax: [10, 10000],
        dimensionMode: '3D',
      })
    );
  });

  it('should set `sizeMode` and `size`', async () => {
    const store = createStoreWith({});
    await store.dispatch(setTestCase(TEST_CASES[2]));
    const { testCases, layerProps } = store.getState();
    expect(testCases).toEqual(
      expect.objectContaining({
        selectedTestCase: TEST_CASES[2],
      })
    );
    expect(layerProps).toEqual(
      expect.objectContaining({
        vehiclesCountValue: 10000,
        animated: true,
        sizeMode: SizeMode.Combined,
        size: 70,
        scale: 1,
        vehiclesCountMinMax: [10, 10000],
        dimensionMode: '2D',
      })
    );
  });
});
