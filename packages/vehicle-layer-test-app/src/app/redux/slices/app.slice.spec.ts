import { BASE_MAP_PROVIDERS } from '../../constants/base-map-providers';
import { createStoreWith } from '../../utils/test-utils';
import {
  APP_FEATURE_KEY,
  appActions,
  appReducer,
  selectMapProvider,
} from './app.slice';

describe('app reducer', () => {
  it('should handle initial state', () => {
    const expected = { baseMapProvider: BASE_MAP_PROVIDERS[0] };
    expect(appReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should set mapProvider', () => {
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
      [APP_FEATURE_KEY]: { baseMapProvider: BASE_MAP_PROVIDERS[2] },
    });

    const mapProvider = selectMapProvider(store.getState());

    expect(mapProvider).toEqual(
      expect.objectContaining({ name: 'Google Maps', id: 'google-maps' })
    );
  });
});
