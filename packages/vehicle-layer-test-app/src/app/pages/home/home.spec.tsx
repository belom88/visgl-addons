import { renderWithProviders } from '../../utils/test-utils';

import Home from './home';

vi.mock('../../components/map-wrapper/map-wrapper', () => {
  return { default: vi.fn() };
});

describe('Home', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<Home />);
    expect(baseElement).toBeTruthy();
  });
});
