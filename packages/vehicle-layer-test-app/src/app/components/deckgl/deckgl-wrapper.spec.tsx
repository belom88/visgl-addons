import { renderWithProviders } from '../../utils/test-utils';
import DeckglWrapper from './deckgl-wrapper';

vi.mock('@deck.gl/react', () => {
  const DeckGL = vi.fn();
  return { DeckGL };
});
vi.mock('react-map-gl/maplibre', () => {
  const Map = vi.fn();
  return { Map };
});
vi.importMock('@belom88/deckgl-vehicle-layer');

describe('Deckgl', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <DeckglWrapper vehicles={[]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
