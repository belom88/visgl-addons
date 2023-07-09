import { RequestStatus } from '../../types';
import { ROUTE_STUB } from '../../utils/test-utils';
import { getRoutes, routesAdapter, routesReducer } from './routes.slice';

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
