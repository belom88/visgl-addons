import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { LayerPropsEdited } from '../../types';

export const LAYER_PROPS_FEATURE_KEY = 'layerProps';

export type LayerPropsState = LayerPropsEdited;

export const initialLayerPropsState: LayerPropsState = {
  vehiclesCountValue: 2000,
  vehiclesCountMinMax: [10, 10000],
  animated: true,
  scale: 1,
};

export const layerPropsSlice = createSlice({
  name: LAYER_PROPS_FEATURE_KEY,
  initialState: initialLayerPropsState,
  reducers: {
    setVehiclesCount: (
      state: LayerPropsState,
      action: PayloadAction<number>
    ) => {
      state.vehiclesCountValue = action.payload;
    },
    toggleAnimation: (state: LayerPropsState) => {
      state.animated = !state.animated;
      if (state.animated) {
        state.vehiclesCountValue = 2000;
        state.vehiclesCountMinMax = [10, 10000];
      } else {
        state.vehiclesCountMinMax = [1000, 100000];
        state.vehiclesCountValue = 10000;
      }
    },
    setAnimation: (state: LayerPropsState, action: PayloadAction<boolean>) => {
      state.animated = action.payload;
      if (state.animated) {
        state.vehiclesCountValue = 2000;
        state.vehiclesCountMinMax = [10, 10000];
      } else {
        state.vehiclesCountMinMax = [1000, 100000];
        state.vehiclesCountValue = 10000;
      }
    },
    setScale: (state: LayerPropsState, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
  },
});

/*
 * Export reducer for store configuration.
 */
export const layerPropsReducer = layerPropsSlice.reducer;

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
 *   dispatch(layerPropsActions.setVehiclesCount(1000))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const layerPropsActions = layerPropsSlice.actions;

export const selectVehiclesCountValue = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].vehiclesCountValue,
  (result) => result
);
export const selectVehiclesCountMinMax = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].vehiclesCountMinMax,
  (result) => result
);
export const selectAnimationState = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].animated,
  (result) => result
);
export const selectScale = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].scale,
  (result) => result
);
