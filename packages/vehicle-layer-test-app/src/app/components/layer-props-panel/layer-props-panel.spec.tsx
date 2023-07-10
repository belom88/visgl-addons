import { render } from '@testing-library/react';

import LayerPropsPanel from './layer-props-panel';

describe('LayerPropsPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LayerPropsPanel />);
    expect(baseElement).toBeTruthy();
  });
});
