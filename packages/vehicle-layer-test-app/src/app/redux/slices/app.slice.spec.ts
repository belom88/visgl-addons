import { BASE_MAP_PROVIDERS } from '../../constants/base-map-providers';
import { BaseMapMode } from '../../types';
import { createStoreWith } from '../../utils/test-utils';
import {
  APP_FEATURE_KEY,
  appActions,
  appReducer,
  selectBaseMapMode,
  selectMapProvider,
  initialState,
} from './app.slice';

describe('app reducer', () => {
  it('should handle initial state', () => {
    const expected = {
      baseMapProvider: BASE_MAP_PROVIDERS[0],
      baseMapMode: BaseMapMode.OVERLAID,
      fps: 60,
      openedMenuId: null,
    };
    expect(appReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should set map provider', () => {
    const state = appReducer(
      undefined,
      appActions.setMapProvider(BASE_MAP_PROVIDERS[2])
    );

    expect(state).toEqual(
      expect.objectContaining({ baseMapProvider: BASE_MAP_PROVIDERS[2] })
    );
  });

  it('should select map provider', () => {
    const store = createStoreWith({
      [APP_FEATURE_KEY]: {
        ...initialState,
        baseMapProvider: BASE_MAP_PROVIDERS[2],
      },
    });

    const mapProvider = selectMapProvider(store.getState());

    expect(mapProvider).toEqual(
      expect.objectContaining({ name: 'Google Maps', id: 'google-maps' })
    );
  });

  it('should set base map mode', () => {
    const state = appReducer(
      undefined,
      appActions.setBaseMapMode(BaseMapMode.INTERLEAVED)
    );

    expect(state).toEqual(
      expect.objectContaining({ baseMapMode: BaseMapMode.INTERLEAVED })
    );
  });

  it('should select base map mode', () => {
    const store = createStoreWith({
      [APP_FEATURE_KEY]: {
        ...initialState,
        baseMapMode: BaseMapMode.INTERLEAVED,
      },
    });

    const baseMapMode = selectBaseMapMode(store.getState());

    expect(baseMapMode).toEqual(BaseMapMode.INTERLEAVED);
  });
});
