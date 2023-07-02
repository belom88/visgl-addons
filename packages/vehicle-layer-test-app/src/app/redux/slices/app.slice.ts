import {
  createAsyncThunk,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../store';

export const APP_FEATURE_KEY = 'app';

type BaseMapProvider = {
  name: string;
  id: string;
};
export const baseMapsProviders: BaseMapProvider[] = [
  { name: 'MapLibre', id: 'maplibre' },
  { name: 'Mapbox 2', id: 'mapbox2' },
  { name: 'Google Maps', id: 'google-maps' },
  { name: 'ArcGIS', id: 'arcgis' },
];

export interface AppState {
  baseMapProvider: BaseMapProvider;
}

// Define the initial state using that type
const initialState: AppState = { baseMapProvider: baseMapsProviders[0] };

export const appSlice = createSlice({
  name: APP_FEATURE_KEY,
  initialState,
  reducers: {
    setMapProviderId: (
      state: AppState,
      payload: PayloadAction<BaseMapProvider>
    ) => {
      state.baseMapProvider = payload.payload;
    },
  },
});

/*
 * Export reducer for store configuration.
 */
export const appReducer = appSlice.reducer;

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
 *   dispatch(appActions.setMapProviderId({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const appActions = appSlice.actions;

export const getAppState = (rootState: {
  [APP_FEATURE_KEY]: AppState;
}): AppState => rootState[APP_FEATURE_KEY];

export const selectMapProviderId = createSelector(
  (state: RootState) => state[APP_FEATURE_KEY].baseMapProvider,
  (result) => result
);
