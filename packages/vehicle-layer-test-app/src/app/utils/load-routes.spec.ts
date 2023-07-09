import { ROUTE_STUB } from './test-utils';
import { load } from '@loaders.gl/core';
import { loadRoutes } from './load-routes';

vi.mock('@loaders.gl/core', () => {
  const load = vi
    .fn()
    .mockImplementation(() =>
      Promise.resolve({ type: 'FeatureCollection', features: [ROUTE_STUB] })
    );
  return { load };
});

describe('utils/load-routes', () => {
  it('should load routes from GeoJSON file', async () => {
    const result = await loadRoutes();
    expect(load).to.toHaveBeenCalledOnce();
    expect(result.length).toBe(1);
    expect(result[0]).toContain({ id: '10' });
  });
});
