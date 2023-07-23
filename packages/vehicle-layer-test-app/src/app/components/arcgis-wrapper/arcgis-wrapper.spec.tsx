import ArcgisWrapper from './arcgis-wrapper';
import { renderWithProviders } from '../../utils/test-utils';

vi.mock('@deck.gl/arcgis', () => {
  const DeckRenderer = vi.fn();
  const loadArcGISModules = vi.fn().mockReturnValue(
    Promise.resolve({
      DeckRenderer,
      modules: [vi.fn(), vi.fn(), { add: vi.fn() }],
    })
  );
  return { loadArcGISModules };
});

describe('ArcgisWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <ArcgisWrapper vehicles={[]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
