import { createStoreWith } from '../../utils/test-utils';
import {
  MAP_FEATURE_KEY,
  initialMapState,
  mapActions,
  mapReducer,
  selectMapState,
} from './map.slice';

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

describe('map reducer', () => {
  it('should handle initial state', () => {
    expect(mapReducer(undefined, { type: '' })).toEqual({
      latitude: 37.7933,
      longitude: -122.396326,
      zoom: 20,
      maxZoom: 25,
      bearing: 0,
      pitch: 50,
    });
  });

  it('should set map state', () => {
    const state = mapReducer(undefined, mapActions.setMapState({ zoom: 15 }));
    expect(state).toEqual(expect.objectContaining({ zoom: 15 }));
  });

  it('should select map state', () => {
    const store = createStoreWith({
      [MAP_FEATURE_KEY]: {
        ...initialMapState,
        bearing: 45,
      },
    });

    const mapState = selectMapState(store.getState());

    expect(mapState).toEqual(expect.objectContaining({ bearing: 45 }));
  });
});
