import { render } from '@testing-library/react';

import Unsupported from './unsupported';

describe('Unsupported', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Unsupported />);
    expect(baseElement).toBeTruthy();
  });
});
