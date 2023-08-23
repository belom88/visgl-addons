import { RequestStatus } from '../../types';
import { ROUTE_STUB } from '../../utils/test-utils';
import {
  getRoutes2d,
  routes2dAdapter,
  routes3dAdapter,
  routesReducer,
} from './routes.slice';

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

describe('routes reducer', () => {
  it('should handle initial state', () => {
    const expected2d = routes2dAdapter.getInitialState({
      loadingStatus: RequestStatus.IDLE,
      error: null,
    });
    const expected3d = routes3dAdapter.getInitialState({
      loadingStatus: RequestStatus.IDLE,
      error: null,
    });

    expect(routesReducer(undefined, { type: '' })).toEqual({
      routes2d: expected2d,
      routes3d: expected3d,
    });
  });

  it('should handle getRoutes', () => {
    let state = routesReducer(undefined, getRoutes2d.pending(''));

    expect(state.routes2d).toEqual(
      expect.objectContaining({
        loadingStatus: RequestStatus.LOADING,
        error: null,
        entities: {},
        ids: [],
      })
    );

    state = routesReducer(state, getRoutes2d.fulfilled([ROUTE_STUB], ''));

    expect(state.routes2d).toEqual(
      expect.objectContaining({
        loadingStatus: RequestStatus.SUCCEDED,
        error: null,
        entities: { 10: ROUTE_STUB },
      })
    );

    state = routesReducer(state, getRoutes2d.rejected(new Error('Uh oh'), ''));

    expect(state.routes2d).toEqual(
      expect.objectContaining({
        loadingStatus: RequestStatus.FAILED,
        error: 'Uh oh',
      })
    );
  });
});
