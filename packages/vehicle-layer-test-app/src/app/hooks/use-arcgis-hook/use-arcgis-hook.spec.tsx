import { render, renderHook } from '@testing-library/react';
import * as React from 'react';

import useArcgisHook from './use-arcgis-hook';
import { createStoreWith, createWrapper } from '../../utils/test-utils';

vi.mock('@arcgis/core/Map', () => {
  const ArcGISMap = vi.fn();
  return { default: ArcGISMap };
});
vi.mock('@arcgis/core/views/SceneView', () => {
  const SceneView = vi.fn();
  return { default: SceneView };
});
vi.mock('@deck.gl/arcgis', () => {
  const DeckRenderer = vi.fn();
  const loadArcGISModules = vi
    .fn()
    .mockReturnValue(Promise.resolve({ DeckRenderer }));
  return { loadArcGISModules };
});
vi.mock('@arcgis/core/views/3d/externalRenderers', () => {
  const add = vi.fn();
  return { add };
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
