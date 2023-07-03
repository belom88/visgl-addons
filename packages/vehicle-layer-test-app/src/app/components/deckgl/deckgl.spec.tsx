import { render } from '@testing-library/react';

import Deckgl from './deckgl';

describe('Deckgl', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Deckgl />);
    expect(baseElement).toBeTruthy();
  });
});
