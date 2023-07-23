import Fps from './fps';
import { renderWithProviders } from '../../utils/test-utils';

describe('Fps', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<Fps />);
    expect(baseElement).toBeTruthy();
  });
});
