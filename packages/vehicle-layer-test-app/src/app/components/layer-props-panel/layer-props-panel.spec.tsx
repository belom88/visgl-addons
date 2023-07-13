import LayerPropsPanel from './layer-props-panel';
import { renderWithProviders } from '../../utils/test-utils';
import { act, fireEvent, screen } from '@testing-library/react';

describe('LayerPropsPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<LayerPropsPanel />);
    expect(baseElement).toBeTruthy();
  });

  describe('Vehicles Count slider', () => {
    beforeEach(() => {
      renderWithProviders(<LayerPropsPanel />);
    });
    it('should initialize with 2000', () => {
      const sliderLabels = screen.getAllByText('Number of Vehicles (2000)');
      expect(sliderLabels.length).toBe(1);
    });

    it('should change slider value', async () => {
      const sliderInput = screen.getByLabelText('Number of Vehicles');
      act(() => fireEvent.change(sliderInput, { target: { value: 5005 } }));
      const sliderLabels = await screen.getAllByText(
        'Number of Vehicles (5005)'
      );
      expect(sliderLabels.length).toBe(1);
    });
  });
});
