import { render, renderHook } from '@testing-library/react';
import * as React from 'react';

import useMaplibreHook from './use-maplibre-hook';
import { createStoreWith, createWrapper } from '../../utils/test-utils';

vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockReturnValue({
    on: vi.fn(),
  });
  return { Map };
});

describe('useMaplibreHook', () => {
  it('should render successfully', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<div ref={ref} />);

    const store = createStoreWith({});
    const { result } = renderHook(() => useMaplibreHook(ref), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toStrictEqual({ current: null });
  });
});
