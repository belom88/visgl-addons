import React, { FunctionComponent, PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { APP_FEATURE_KEY, appReducer } from '../redux/slices/app.slice';
import {
  ROUTES_FEATURE_KEY,
  routesReducer,
} from '../redux/slices/routes.slice';
import {
  LAYER_PROPS_FEATURE_KEY,
  layerPropsReducer,
} from '../redux/slices/layer-props.slice';
import { AppStore, RootState } from '../redux/store';
import { GeojsonRouteFeature } from './load-routes';
import {
  TEST_CASES_FEATURE_KEY,
  testCasesReducer,
} from '../redux/slices/test-cases.slice';
import { MAP_FEATURE_KEY, mapReducer } from '../redux/slices/map.slice';
import {
  NOTIFICATIONS_FEATURE_KEY,
  notificationsReducer,
} from '../redux/slices/notifications.slice';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export const ROUTE_STUB: GeojsonRouteFeature = {
  id: '10',
  type: 'Feature',
  properties: {
    routeId: '1',
    agencyId: 'SF',
    routeShortName: '1',
    routeLongName: 'CALIFORNIA',
    routeDesc: '5am-12 midnight daily',
    routeType: '3',
    routeUrl: 'http://www.sfmta.com/1',
    routeColor: '005B95',
    routeTextColor: 'FFFFFF',
    shapeId: '101',
    distancesPerPoint: [
      0, 0.0103265, 0.0206529, 0.0821224, 0.138109, 0.1490498,
    ],
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [-122.396784, 37.795471],
      [-122.396968, 37.795436],
      [-122.396784, 37.795471],
      [-122.396598, 37.794593],
      [-122.397611, 37.794464],
    ],
  },
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        [APP_FEATURE_KEY]: appReducer,
        [ROUTES_FEATURE_KEY]: routesReducer,
        [LAYER_PROPS_FEATURE_KEY]: layerPropsReducer,
        [TEST_CASES_FEATURE_KEY]: testCasesReducer,
        [MAP_FEATURE_KEY]: mapReducer,
        [NOTIFICATIONS_FEATURE_KEY]: notificationsReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export const createStoreWith = (
  preloadedState: PreloadedState<RootState>
): AppStore => {
  return configureStore({
    reducer: {
      [APP_FEATURE_KEY]: appReducer,
      [ROUTES_FEATURE_KEY]: routesReducer,
      [LAYER_PROPS_FEATURE_KEY]: layerPropsReducer,
      [TEST_CASES_FEATURE_KEY]: testCasesReducer,
      [MAP_FEATURE_KEY]: mapReducer,
      [NOTIFICATIONS_FEATURE_KEY]: notificationsReducer,
    },
    preloadedState,
  });
};

export const createWrapper =
  (store: AppStore): FunctionComponent<PropsWithChildren> =>
  ({ children }) =>
    <Provider store={store}>{children}</Provider>;
