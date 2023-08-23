import { BASE_MAP_PROVIDERS } from '../../../constants/base-map-providers';
import {
  TERRAIN_MAPBOX2_HIGHT_TILT_BUG,
  TERRAIN_MAPLIBRE_LOW_PERFORMANCE,
  TERRAIN_MAPLIBRE_SYNCHRONIZATION_ISSUE,
} from '../../../constants/notification-messages';
import { BaseMapMode } from '../../../types';
import { createStoreWith } from '../../../utils/test-utils';
import { APP_FEATURE_KEY, initialState } from '../app.slice';
import {
  LAYER_PROPS_FEATURE_KEY,
  initialLayerPropsState,
} from '../layer-props.slice';
import { getNotification } from './state-notificatons-utils';

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

describe('reduces / state-notifications-utils', () => {
  it('getNotification - no notification', () => {
    const store = createStoreWith({});
    const notification = getNotification(store.getState());
    expect(notification).toBeNull();
  });
  it('getNotification - Maplibre overlaid', () => {
    const store = createStoreWith({
      [LAYER_PROPS_FEATURE_KEY]: { ...initialLayerPropsState, terrain: true },
    });
    const notification = getNotification(store.getState());
    expect(notification).toEqual({
      severity: 'warning',
      message: TERRAIN_MAPLIBRE_SYNCHRONIZATION_ISSUE,
    });
  });

  it('getNotification - Maplibre interleaved', () => {
    const store = createStoreWith({
      [LAYER_PROPS_FEATURE_KEY]: { ...initialLayerPropsState, terrain: true },
      [APP_FEATURE_KEY]: {
        ...initialState,
        baseMapMode: BaseMapMode.INTERLEAVED,
      },
    });
    const notification = getNotification(store.getState());
    expect(notification).toEqual({
      severity: 'warning',
      message: TERRAIN_MAPLIBRE_LOW_PERFORMANCE,
    });
  });

  it('getNotification - Mapbox interleaved', () => {
    const store = createStoreWith({
      [LAYER_PROPS_FEATURE_KEY]: { ...initialLayerPropsState, terrain: true },
      [APP_FEATURE_KEY]: {
        ...initialState,
        baseMapProvider: BASE_MAP_PROVIDERS[1],
        baseMapMode: BaseMapMode.INTERLEAVED,
      },
    });
    const notification = getNotification(store.getState());
    expect(notification).toEqual({
      severity: 'warning',
      message: TERRAIN_MAPBOX2_HIGHT_TILT_BUG,
    });
  });

  it('getNotification - Google maps not supported', () => {
    const store = createStoreWith({
      [LAYER_PROPS_FEATURE_KEY]: { ...initialLayerPropsState, terrain: true },
      [APP_FEATURE_KEY]: {
        ...initialState,
        baseMapProvider: BASE_MAP_PROVIDERS[2],
      },
    });
    const notification = getNotification(store.getState());
    expect(notification).toEqual({
      severity: 'info',
      message: `Terrain with ${BASE_MAP_PROVIDERS[2].name} map provider is not supported`,
    });
  });

  it("getNotification - Arcgis overlaid don't cause notification", () => {
    const store = createStoreWith({
      [LAYER_PROPS_FEATURE_KEY]: { ...initialLayerPropsState, terrain: true },
      [APP_FEATURE_KEY]: {
        ...initialState,
        baseMapProvider: BASE_MAP_PROVIDERS[3],
        baseMapMode: BaseMapMode.OVERLAID,
      },
    });
    const notification = getNotification(store.getState());
    expect(notification).toBeNull();
  });
});
