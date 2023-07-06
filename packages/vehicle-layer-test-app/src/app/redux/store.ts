import { configureStore } from '@reduxjs/toolkit';
import { APP_FEATURE_KEY, appReducer } from './slices/app.slice';
import { ROUTES_FEATURE_KEY, routesReducer } from './slices/routes.slice';

export const store = configureStore({
  reducer: {
    [ROUTES_FEATURE_KEY]: routesReducer,
    [APP_FEATURE_KEY]: appReducer,
  },
  // Additional middleware can be passed to this array
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
  // Optional Redux store enhancers
  enhancers: [],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
