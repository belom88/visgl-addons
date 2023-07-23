import { render, renderHook } from '@testing-library/react';
import * as React from 'react';

import useMaplibreHook from './use-mapbox-hook';
import { createStoreWith, createWrapper } from '../../utils/test-utils';
import { BaseMapProviderId } from '../../constants/base-map-providers';

vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockReturnValue({
    on: vi.fn(),
  });
  return { Map };
});

describe('useMapboxHook', () => {
  it('should render successfully', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<div ref={ref} />);

    const store = createStoreWith({});
    const { result } = renderHook(
      () => useMaplibreHook(ref, BaseMapProviderId.maplibre),
      {
        wrapper: createWrapper(store),
      }
    );

    expect(result.current).toStrictEqual(null);
  });
});
