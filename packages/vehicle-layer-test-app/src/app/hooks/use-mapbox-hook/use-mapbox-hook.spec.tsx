import { render, renderHook } from '@testing-library/react';
import * as React from 'react';

import { useMapbox } from './use-mapbox-hook';
import { createStoreWith, createWrapper } from '../../utils/test-utils';
import { BaseMapProviderId } from '../../constants/base-map-providers';

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

vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockReturnValue({
    on: vi.fn(),
  });
  return { Map };
});

describe('useMapbox', () => {
  it('should render successfully', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<div ref={ref} />);

    const store = createStoreWith({});
    const { result } = renderHook(
      () => useMapbox(ref, BaseMapProviderId.maplibre),
      {
        wrapper: createWrapper(store),
      }
    );

    expect(result.current).toStrictEqual(null);
  });
});
