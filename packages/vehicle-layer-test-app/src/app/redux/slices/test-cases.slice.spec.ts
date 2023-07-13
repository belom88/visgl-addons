import { TEST_CASES } from '../../constants/test-cases';
import { createStoreWith } from '../../utils/test-utils';
import { setTestCase, testCasesReducer } from './test-cases.slice';

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
        vehiclesCount: 5000,
      })
    );
  });
});
