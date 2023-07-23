import { render, renderHook } from '@testing-library/react';
import * as React from 'react';

import useArcgisHook from './use-arcgis-hook';
import { createStoreWith, createWrapper } from '../../utils/test-utils';

vi.mock('@deck.gl/arcgis', () => {
  const DeckRenderer = vi.fn();
  const loadArcGISModules = vi
    .fn()
    .mockReturnValue(
      Promise.resolve({
        DeckRenderer,
        modules: [vi.fn(), vi.fn(), { add: vi.fn() }],
      })
    );
  return { loadArcGISModules };
});

describe('useArcgisHook', () => {
  it('should render successfully', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<div ref={ref} />);

    const store = createStoreWith({});
    const { result } = renderHook(() => useArcgisHook(ref), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toStrictEqual(null);
  });
});
