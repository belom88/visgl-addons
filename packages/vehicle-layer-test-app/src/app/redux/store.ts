import {
  PreloadedState,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { APP_FEATURE_KEY, appReducer } from './slices/app.slice';
import { ROUTES_FEATURE_KEY, routesReducer } from './slices/routes.slice';
import {
  LAYER_PROPS_FEATURE_KEY,
  layerPropsReducer,
} from './slices/layer-props.slice';
import {
  TEST_CASES_FEATURE_KEY,
  testCasesReducer,
} from './slices/test-cases.slice';

const rootReducer = combineReducers({
  [ROUTES_FEATURE_KEY]: routesReducer,
  [APP_FEATURE_KEY]: appReducer,
  [LAYER_PROPS_FEATURE_KEY]: layerPropsReducer,
  [TEST_CASES_FEATURE_KEY]: testCasesReducer,
});
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    // Additional middleware can be passed to this array
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
    // Optional Redux store enhancers
    enhancers: [],
  });
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
