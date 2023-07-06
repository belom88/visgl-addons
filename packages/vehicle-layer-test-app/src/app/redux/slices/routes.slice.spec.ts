import { fetchRoutes, routesAdapter, routesReducer } from './routes.slice';

describe('routes reducer', () => {
  it('should handle initial state', () => {
    const expected = routesAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(routesReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchRoutes', () => {
    let state = routesReducer(undefined, fetchRoutes.pending(''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
        ids: [],
      })
    );

    state = routesReducer(state, fetchRoutes.fulfilled([{ id: 1 }], ''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
        ids: [1],
      })
    );

    state = routesReducer(state, fetchRoutes.rejected(new Error('Uh oh'), ''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
        ids: [1],
      })
    );
  });
});
