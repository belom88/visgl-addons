import { renderWithProviders } from '../../utils/test-utils';
import TestCasesPanel from './test-cases-panel';

describe('TestCasesPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<TestCasesPanel />);
    expect(baseElement).toBeTruthy();
  });

  // TODO: Find how to update the component after click
  // it('should change test case', async () => {
  //   const { container } = renderWithProviders(<TestCasesPanel />);
  //   const button = screen.getByLabelText('test-case-animation-5000');
  //   act(() => {
  //     fireEvent.click(button);
  //   });
  //   const selectedElements = container.getElementsByClassName('Mui-selected');
  //   expect(selectedElements.length).toBe(1);
  //   const button2 = screen.getByLabelText('test-case-animation-2000');
  //   expect(selectedElements[0]).equals(button2);
  //   // const button2 = await screen.getByLabelText('test-case-animation-5000');
  //   // expect(button2.classList.contains('Mui-selected')).toBeTruthy();
  // });
});
