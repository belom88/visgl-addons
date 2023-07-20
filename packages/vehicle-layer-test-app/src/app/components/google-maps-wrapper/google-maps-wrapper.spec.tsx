import GoogleMapsWrapper from './google-maps-wrapper';
import { renderWithProviders } from '../../utils/test-utils';

describe('GoogleMapsWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <GoogleMapsWrapper vehicles={[]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
