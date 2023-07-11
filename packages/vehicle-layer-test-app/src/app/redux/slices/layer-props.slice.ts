import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const LAYER_PROPS_FEATURE_KEY = 'layerProps';

export interface LayerPropsState {
  /** Number of vehicles to put on the map */
  vehiclesCount: number;
}

export const initialLayerPropsState: LayerPropsState = {
  vehiclesCount: 2000,
};

export const layerPropsSlice = createSlice({
  name: LAYER_PROPS_FEATURE_KEY,
  initialState: initialLayerPropsState,
  reducers: {
    setVehiclesCount: (state: LayerPropsState, payload) => {
      state.vehiclesCount = payload.payload;
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

export const selectVehiclesCount = createSelector(
  (state: RootState) => state[LAYER_PROPS_FEATURE_KEY].vehiclesCount,
  (result) => result
);
