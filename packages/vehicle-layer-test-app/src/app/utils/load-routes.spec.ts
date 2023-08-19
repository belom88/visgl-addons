import { ROUTE_STUB } from './test-utils';
import { load } from '@loaders.gl/core';
import { loadRoutes2d } from './load-routes';

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
    const result = await loadRoutes2d();
    expect(load).to.toHaveBeenCalledOnce();
    expect(result.length).toBe(1);
    expect(result[0]).toContain({ id: '10' });
  });
});
