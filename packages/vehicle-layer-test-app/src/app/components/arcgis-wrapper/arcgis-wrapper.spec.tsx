import ArcgisWrapper from './arcgis-wrapper';
import { renderWithProviders } from '../../utils/test-utils';

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

describe('ArcgisWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <ArcgisWrapper vehicles={[]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
