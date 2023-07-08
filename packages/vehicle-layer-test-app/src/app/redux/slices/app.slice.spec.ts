import { BASE_MAP_PROVIDERS, appActions, appReducer } from './app.slice';

describe('app reducer', () => {
  it('should handle initial state', () => {
    const expected = { baseMapProvider: BASE_MAP_PROVIDERS[0] };
    expect(appReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should set mapProviderId', () => {
    const state = appReducer(
      undefined,
      appActions.setMapProvider(BASE_MAP_PROVIDERS[2])
    );

    expect(state).toEqual(
      expect.objectContaining({ baseMapProvider: BASE_MAP_PROVIDERS[2] })
    );
  });
});
