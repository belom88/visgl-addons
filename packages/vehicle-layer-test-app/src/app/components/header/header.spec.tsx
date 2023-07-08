import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders } from '../../utils/test-utils';

import Header from './header';

describe('Header', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
