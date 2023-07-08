import { RequestStatus } from '../../types';
import { GeojsonRouteFeature } from '../../utils/load-routes';
import { getRoutes, routesAdapter, routesReducer } from './routes.slice';

const ROUTE_STUB: GeojsonRouteFeature = {
  id: '10',
  type: 'Feature',
  properties: {
    routeId: '1',
    agencyId: 'SF',
    routeShortName: '1',
    routeLongName: 'CALIFORNIA',
    routeDesc: '5am-12 midnight daily',
    routeType: '3',
    routeUrl: 'http://www.sfmta.com/1',
    routeColor: '005B95',
    routeTextColor: 'FFFFFF',
    shapeId: '101',
    distancesPerPoint: [
      0, 0.0103265, 0.0206529, 0.0821224, 0.138109, 0.1490498,
    ],
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [-122.396784, 37.795471],
      [-122.396968, 37.795436],
      [-122.396784, 37.795471],
      [-122.396598, 37.794593],
      [-122.397611, 37.794464],
    ],
  },
};

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
