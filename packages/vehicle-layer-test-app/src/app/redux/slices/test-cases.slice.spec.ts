import { SizeMode } from '@belom88/vehicle-layer';
import { TEST_CASES } from '../../constants/test-cases';
import { createStoreWith } from '../../utils/test-utils';
import { setTestCase, testCasesReducer } from './test-cases.slice';
import { UseCaseId } from '../../types';

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
vi.mock('react-map-gl/maplibre', () => {
  const Map = vi.fn();
  const Source = vi.fn();
  return { Map, Source };
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
        useCase: UseCaseId.ANFIELD,
        vehiclesCountValue: 50000,
        vehiclesCountMinMax: [1000, 100000],
        animated: false,
        pickable: false,
        terrain: true,
        sizeMode: SizeMode.Original,
        size: 20,
        scale: 1,
        dimensionMode: '3D',
        backgroundColor2d: undefined,
        color3D: undefined,
        commonColor: undefined,
        foregroundColor2d: undefined,
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
        useCase: UseCaseId.SF_TRANSIT,
        vehiclesCountValue: 2000,
        vehiclesCountMinMax: [10, 10000],
        animated: true,
        pickable: false,
        terrain: false,
        sizeMode: SizeMode.Original,
        size: 20,
        scale: 1,
        dimensionMode: '3D',
        backgroundColor2d: undefined,
        color3D: undefined,
        commonColor: undefined,
        foregroundColor2d: undefined,
      })
    );
  });
});
