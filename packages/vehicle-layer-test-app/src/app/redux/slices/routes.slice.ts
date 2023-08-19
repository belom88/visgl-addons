import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  GeojsonRouteFeature,
  loadRoutes2d,
  loadRoutes3d,
} from '../../utils/load-routes';
import { RequestStatus } from '../../types';

export const ROUTES_FEATURE_KEY = 'routes';

export interface RoutesDimensionState extends EntityState<GeojsonRouteFeature> {
  loadingStatus: RequestStatus;
  error: string | null;
}

export interface RoutesState {
  routes2d: RoutesDimensionState;
  routes3d: RoutesDimensionState;
}

export const routes2dAdapter = createEntityAdapter<GeojsonRouteFeature>();
export const routes3dAdapter = createEntityAdapter<GeojsonRouteFeature>();

export const getRoutes2d = createAsyncThunk(
  `${ROUTES_FEATURE_KEY}/getRoutes2d`,
  async () => {
    const routes = await loadRoutes2d();
    return routes;
  }
);

export const getRoutes3d = createAsyncThunk(
  `${ROUTES_FEATURE_KEY}/getRoutes3d`,
  async () => {
    const routes = await loadRoutes3d();
    return routes;
  }
);

export const initialRoutesState: RoutesState = {
  routes2d: routes2dAdapter.getInitialState({
    loadingStatus: RequestStatus.IDLE,
    error: null,
  }),
  routes3d: routes3dAdapter.getInitialState({
    loadingStatus: RequestStatus.IDLE,
    error: null,
  }),
};

export const routesSlice = createSlice({
  name: ROUTES_FEATURE_KEY,
  initialState: initialRoutesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoutes2d.pending, (state: RoutesState) => {
        state.routes2d.loadingStatus = RequestStatus.LOADING;
      })
      .addCase(
        getRoutes2d.fulfilled,
        (state: RoutesState, action: PayloadAction<GeojsonRouteFeature[]>) => {
          routes2dAdapter.setAll(state.routes2d, action.payload);
          state.routes2d.loadingStatus = RequestStatus.SUCCEDED;
        }
      )
      .addCase(getRoutes2d.rejected, (state: RoutesState, action) => {
        state.routes2d.loadingStatus = RequestStatus.FAILED;
        state.routes2d.error = action.error.message || null;
      })
      .addCase(getRoutes3d.pending, (state: RoutesState) => {
        state.routes3d.loadingStatus = RequestStatus.LOADING;
      })
      .addCase(
        getRoutes3d.fulfilled,
        (state: RoutesState, action: PayloadAction<GeojsonRouteFeature[]>) => {
          routes3dAdapter.setAll(state.routes3d, action.payload);
          state.routes3d.loadingStatus = RequestStatus.SUCCEDED;
        }
      )
      .addCase(getRoutes3d.rejected, (state: RoutesState, action) => {
        state.routes3d.loadingStatus = RequestStatus.FAILED;
        state.routes3d.error = action.error.message || null;
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
const { selectAll: selectRoutes2dAll, selectEntities: selectRoute2dEntities } =
  routes2dAdapter.getSelectors();
const { selectAll: selectRoutes3dAll, selectEntities: selectRoute3dEntities } =
  routes3dAdapter.getSelectors();

export const getRoutesState = (rootState: {
  [ROUTES_FEATURE_KEY]: RoutesState;
}): RoutesState => rootState[ROUTES_FEATURE_KEY];

const getRoute2dState = (rootState: {
  [ROUTES_FEATURE_KEY]: RoutesState;
}): RoutesDimensionState => rootState[ROUTES_FEATURE_KEY].routes2d;
export const selectAllRoutes2d = createSelector(
  getRoute2dState,
  selectRoutes2dAll
);
export const selectRoutes2dEntities = createSelector(
  getRoute2dState,
  selectRoute2dEntities
);

const getRoute3dState = (rootState: {
  [ROUTES_FEATURE_KEY]: RoutesState;
}): RoutesDimensionState => rootState[ROUTES_FEATURE_KEY].routes3d;
export const selectAllRoutes3d = createSelector(
  getRoute3dState,
  selectRoutes3dAll
);
export const selectRoutes3dEntities = createSelector(
  getRoute3dState,
  selectRoute3dEntities
);
