import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import BaseMapModeSwitcher from './base-map-mode-switcher';
import { BaseMapMode } from '../../types';

vi.mock('@deck.gl/core', () => {
  const CompositeLayer = vi.fn();
  return { CompositeLayer };
});
vi.mock('@deck.gl/layers', () => {
  const IconLayer = vi.fn();
  const IconLayerProps = {};
  return { IconLayer, IconLayerProps };
});
vi.mock('@deck.gl/mesh-layers', () => {
  const ScenegraphLayer = vi.fn();
  const ScenegraphLayerProps = {};
  return { ScenegraphLayer, ScenegraphLayerProps };
});

describe('BaseMapModeSwitcher', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<BaseMapModeSwitcher />);
    expect(baseElement).toBeTruthy();
  });

  describe('Base Map radio group', () => {
    beforeEach(() => {
      renderWithProviders(<BaseMapModeSwitcher />);
    });
    it('should initialize with "Overlaid" mode selected', () => {
      const baseMapInput = screen.getByDisplayValue(
        BaseMapMode.OVERLAID
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
