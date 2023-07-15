import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { BaseMapMode, BaseMapProvider } from '../../types';
import { BASE_MAP_PROVIDERS } from '../../constants/base-map-providers';

export const APP_FEATURE_KEY = 'app';

export interface AppState {
  baseMapProvider: BaseMapProvider;
  baseMapMode: BaseMapMode;
}

export const initialState: AppState = {
  baseMapProvider: BASE_MAP_PROVIDERS[0],
  baseMapMode: BaseMapMode.OVERLAPPED,
};

export const appSlice = createSlice({
  name: APP_FEATURE_KEY,
  initialState,
  reducers: {
    setMapProvider: (
      state: AppState,
      payload: PayloadAction<BaseMapProvider>
    ) => {
      state.baseMapProvider = payload.payload;
    },
    setBaseMapMode: (state: AppState, payload: PayloadAction<BaseMapMode>) => {
      state.baseMapMode = payload.payload;
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

export const selectMapProvider = createSelector(
  (state: RootState) => state[APP_FEATURE_KEY].baseMapProvider,
  (result) => result
);

export const selectBaseMapMode = createSelector(
  (state: RootState) => state[APP_FEATURE_KEY].baseMapMode,
  (result) => result
);
