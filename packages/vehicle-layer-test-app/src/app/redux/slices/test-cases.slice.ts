import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { layerPropsActions } from './layer-props.slice';
import { TestCase } from '../../types';
import { TEST_CASES } from '../../constants/test-cases';
import { RootState } from '../store';

export const TEST_CASES_FEATURE_KEY = 'testCases';

export interface TestCasesState {
  selectedTestCase: TestCase | null;
}

const initialState: TestCasesState = { selectedTestCase: TEST_CASES[0] };

export const setTestCase = createAsyncThunk(
  `${TEST_CASES_FEATURE_KEY}/setTestCase`,
  async (testCase: TestCase, { dispatch }) => {
    dispatch(layerPropsActions.setAnimation(testCase.layerProps.animated));
    dispatch(
      layerPropsActions.setVehiclesCount(testCase.layerProps.vehiclesCountValue)
    );
    dispatch(layerPropsActions.setScale(testCase.layerProps.scale));
    dispatch(
      layerPropsActions.setDimensionMode(testCase.layerProps.dimensionMode)
    );

    return testCase;
  }
);

export const testCasesSlice = createSlice({
  name: TEST_CASES_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      setTestCase.fulfilled,
      (state: TestCasesState, action: PayloadAction<TestCase>) => {
        state.selectedTestCase = action.payload;
      }
    );
  },
});

/*
 * Export reducer for store configuration.
 */
export const testCasesReducer = testCasesSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(testCasesActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const testCasesActions = testCasesSlice.actions;

export const selectSelectedTestCase = createSelector(
  (state: RootState) => state[TEST_CASES_FEATURE_KEY].selectedTestCase,
  (result) => result
);
