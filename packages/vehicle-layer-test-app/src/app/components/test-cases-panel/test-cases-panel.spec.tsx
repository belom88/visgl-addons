import { fireEvent, screen, waitFor } from '@testing-library/react';
import { createStoreWith, renderWithProviders } from '../../utils/test-utils';
import TestCasesPanel from './test-cases-panel';
import { TEST_CASES } from '../../constants/test-cases';

describe('TestCasesPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<TestCasesPanel />);
    expect(baseElement).toBeTruthy();
  });

  it('should change test case', async () => {
    const store = createStoreWith({});
    renderWithProviders(<TestCasesPanel />, {
      store,
    });
    const button = screen.getByLabelText('test-case-animation-5000');

    fireEvent.click(button);

    await waitFor(() => {
      expect(store.getState().testCases.selectedTestCase?.id).toBe(
        'animation-5000'
      );
    });
  });

  it('should render with different test case selected', async () => {
    renderWithProviders(<TestCasesPanel />, {
      preloadedState: {
        testCases: { selectedTestCase: TEST_CASES[1] },
      },
    });
    const button = screen.getByLabelText('test-case-animation-5000');
    expect(button.classList.contains('Mui-selected')).toBeTruthy();
  });
});
