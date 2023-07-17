import InterleavedMap from './interleaved-map';
import { renderWithProviders } from '../../utils/test-utils';

vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockReturnValue({
    on: vi.fn(),
  });
  return { Map };
});

describe('InterleavedMap', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<InterleavedMap vehicles={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
