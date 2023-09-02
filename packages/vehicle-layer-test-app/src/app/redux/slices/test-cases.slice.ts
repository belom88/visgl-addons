import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { layerPropsActions, setTerrain } from './layer-props.slice';
import { PopoverId, TestCase } from '../../types';
import { TEST_CASES } from '../../constants/test-cases';
import { RootState } from '../store';

export const TEST_CASES_FEATURE_KEY = 'testCases';

export interface TestCasesState {
  selectedTestCase: TestCase | null;
}

const initialState: TestCasesState = { selectedTestCase: TEST_CASES[2] };

export const setTestCase = createAsyncThunk(
  `${TEST_CASES_FEATURE_KEY}/setTestCase`,
  async (testCase: TestCase, { dispatch }) => {
    dispatch(layerPropsActions.setAnimation(testCase.layerProps.animated));
    dispatch(layerPropsActions.setSizeMode(testCase.layerProps.sizeMode));
    dispatch(layerPropsActions.setSize(testCase.layerProps.size));
    dispatch(layerPropsActions.setScale(testCase.layerProps.scale));
    dispatch(
      layerPropsActions.setDimensionMode(testCase.layerProps.dimensionMode)
    );
    dispatch(setTerrain(testCase.layerProps.terrain));
    dispatch(layerPropsActions.setUseCase(testCase.layerProps.useCase));
    dispatch(layerPropsActions.setPicking(testCase.layerProps.pickable));
    dispatch(
      layerPropsActions.setVehicleColor({
        popoverId: PopoverId.VEHICLE_LAYER_COMMON_COLOR,
        color: testCase.layerProps.commonColor,
      })
    );
    dispatch(
      layerPropsActions.setVehicleColor({
        popoverId: PopoverId.VEHICLE_LAYER_3D_COLOR,
        color: testCase.layerProps.color3D,
      })
    );
    dispatch(
      layerPropsActions.setVehicleColor({
        popoverId: PopoverId.VEHICLE_LAYER_2D_FOREGROUND,
        color: testCase.layerProps.foregroundColor2d,
      })
    );
    dispatch(
      layerPropsActions.setVehicleColor({
        popoverId: PopoverId.VEHICLE_LAYER_2D_BACKGROUND,
        color: testCase.layerProps.backgroundColor2d,
      })
    );
    dispatch(
      layerPropsActions.setVehiclesCount(testCase.layerProps.vehiclesCountValue)
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
