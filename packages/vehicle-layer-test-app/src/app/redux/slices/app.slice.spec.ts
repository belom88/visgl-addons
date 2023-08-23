import { BASE_MAP_PROVIDERS } from '../../constants/base-map-providers';
import { BaseMapMode } from '../../types';
import { createStoreWith } from '../../utils/test-utils';
import {
  APP_FEATURE_KEY,
  appReducer,
  selectBaseMapMode,
  selectMapProvider,
  initialState,
  setMapProvider,
  setBaseMapMode,
} from './app.slice';

vi.mock('@deck.gl/core', () => {
  const CompositeLayer = vi.fn();
  return { CompositeLayer };
});
vi.mock('@deck.gl/layers', () => {
  const IconLayer = vi.fn();
  const IconLayerProps = {};
  return { IconLayer, IconLayerProps };
});
vi.mock('@deck.gl/mesh-layers', () => {
  const ScenegraphLayer = vi.fn();
  const ScenegraphLayerProps = {};
  return { ScenegraphLayer, ScenegraphLayerProps };
});

vi.mock('react-map-gl/maplibre', () => {
  const Map = vi.fn();
  const Source = vi.fn();
  return { Map, Source };
});

describe('app reducer', () => {
  it('should handle initial state', () => {
    const expected = {
      baseMapProvider: BASE_MAP_PROVIDERS[0],
      baseMapMode: BaseMapMode.OVERLAID,
      fps: 60,
      openedPopoverId: null,
      pickingData: null,
    };
    expect(appReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should set map provider', () => {
    const state = appReducer(
      undefined,
      setMapProvider.fulfilled(BASE_MAP_PROVIDERS[2], '', BASE_MAP_PROVIDERS[2])
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
      setBaseMapMode.fulfilled(
        BaseMapMode.INTERLEAVED,
        '',
        BaseMapMode.INTERLEAVED
      )
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
