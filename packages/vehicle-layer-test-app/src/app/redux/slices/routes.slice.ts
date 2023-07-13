import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { GeojsonRouteFeature, loadRoutes } from '../../utils/load-routes';
import { RequestStatus } from '../../types';

export const ROUTES_FEATURE_KEY = 'routes';

export interface RoutesState extends EntityState<GeojsonRouteFeature> {
  loadingStatus: RequestStatus;
  error: string | null;
}

export const routesAdapter = createEntityAdapter<GeojsonRouteFeature>();

export const getRoutes = createAsyncThunk(
  `${ROUTES_FEATURE_KEY}/getRoutes`,
  async () => {
    const routes = await loadRoutes();
    return routes;
  }
);

export const initialRoutesState: RoutesState = routesAdapter.getInitialState({
  loadingStatus: RequestStatus.IDLE,
  error: null,
});

export const routesSlice = createSlice({
  name: ROUTES_FEATURE_KEY,
  initialState: initialRoutesState,
  reducers: {
    add: routesAdapter.addOne,
    remove: routesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoutes.pending, (state: RoutesState) => {
        state.loadingStatus = RequestStatus.LOADING;
      })
      .addCase(
        getRoutes.fulfilled,
        (state: RoutesState, action: PayloadAction<GeojsonRouteFeature[]>) => {
          routesAdapter.setAll(state, action.payload);
          state.loadingStatus = RequestStatus.SUCCEDED;
        }
      )
      .addCase(getRoutes.rejected, (state: RoutesState, action) => {
        state.loadingStatus = RequestStatus.FAILED;
        state.error = action.error.message || null;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const routesReducer = routesSlice.reducer;

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
 *   dispatch(routesActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const routesActions = routesSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllRoutes);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = routesAdapter.getSelectors();

export const getRoutesState = (rootState: {
  [ROUTES_FEATURE_KEY]: RoutesState;
}): RoutesState => rootState[ROUTES_FEATURE_KEY];

export const selectAllRoutes = createSelector(getRoutesState, selectAll);

export const selectRoutesEntities = createSelector(
  getRoutesState,
  selectEntities
);
