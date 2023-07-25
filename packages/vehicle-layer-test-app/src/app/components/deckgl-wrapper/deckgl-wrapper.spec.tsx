import { renderWithProviders } from '../../utils/test-utils';
import DeckglWrapper from './deckgl-wrapper';

vi.mock('@deck.gl/core', () => {
  const CompositeLayer = vi.fn();
  return { CompositeLayer };
});
vi.mock('@deck.gl/layers', () => {
  const ScatterplotLayer = vi.fn();
  const ScatterplotLayerProps = {};
  return { ScatterplotLayer, ScatterplotLayerProps };
});
vi.mock('@deck.gl/mesh-layers', () => {
  const ScenegraphLayer = vi.fn();
  const ScenegraphLayerProps = {};
  return { ScenegraphLayer, ScenegraphLayerProps };
});

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
