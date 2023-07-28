import OpacityIcon from '@mui/icons-material/Opacity';
import ColorPicker from './color-picker';
import { renderWithProviders } from '../../utils/test-utils';
import { PopoverId } from '../../types';

describe('ColorPicker', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <ColorPicker
        popoverId={PopoverId.VEHICLE_LAYER_3D_COLOR}
        Icon={OpacityIcon}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
