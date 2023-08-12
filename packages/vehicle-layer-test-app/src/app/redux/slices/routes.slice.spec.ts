import { RequestStatus } from '../../types';
import { ROUTE_STUB } from '../../utils/test-utils';
import { getRoutes, routesAdapter, routesReducer } from './routes.slice';

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

describe('routes reducer', () => {
  it('should handle initial state', () => {
    const expected = routesAdapter.getInitialState({
      loadingStatus: RequestStatus.IDLE,
      error: null,
    });

    expect(routesReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle getRoutes', () => {
    let state = routesReducer(undefined, getRoutes.pending(''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: RequestStatus.LOADING,
        error: null,
        entities: {},
        ids: [],
      })
    );

    state = routesReducer(state, getRoutes.fulfilled([ROUTE_STUB], ''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: RequestStatus.SUCCEDED,
        error: null,
        entities: { 10: ROUTE_STUB },
      })
    );

    state = routesReducer(state, getRoutes.rejected(new Error('Uh oh'), ''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: RequestStatus.FAILED,
        error: 'Uh oh',
      })
    );
  });
});
