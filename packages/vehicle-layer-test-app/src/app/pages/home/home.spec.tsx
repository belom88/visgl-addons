import { renderWithProviders } from '../../utils/test-utils';

import Home from './home';

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

vi.mock('../../components/map-wrapper/map-wrapper', () => {
  return { default: vi.fn() };
});

describe('Home', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<Home />);
    expect(baseElement).toBeTruthy();
  });
});
