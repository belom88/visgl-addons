import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import BaseMapModeSwitcher from './base-map-mode-switcher';
import { BaseMapMode } from '../../types';

describe('BaseMapModeSwitcher', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<BaseMapModeSwitcher />);
    expect(baseElement).toBeTruthy();
  });

  describe('Base Map radio group', () => {
    beforeEach(() => {
      renderWithProviders(<BaseMapModeSwitcher />);
    });
    it('should initialize with "Overlapped" mode selected', () => {
      const baseMapInput = screen.getByDisplayValue(
        BaseMapMode.OVERLAPPED
      ) as HTMLInputElement;
      expect(baseMapInput.checked).toBeTruthy();
    });

    it('should change Base Map mode', async () => {
      const baseMapInput = screen.getByDisplayValue(
        BaseMapMode.INTERLEAVED
      ) as HTMLInputElement;
      act(() => fireEvent.click(baseMapInput));
      expect(baseMapInput.checked).toBeTruthy();
    });
  });
});
