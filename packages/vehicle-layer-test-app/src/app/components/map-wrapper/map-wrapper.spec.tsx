import MapWrapper from './map-wrapper';
import { renderWithProviders } from '../../utils/test-utils';

vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockReturnValue({
    on: vi.fn(),
  });
  return { Map };
});

describe('MapWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<MapWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
