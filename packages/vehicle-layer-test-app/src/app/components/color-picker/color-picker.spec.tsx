import OpacityIcon from '@mui/icons-material/Opacity';
import ColorPicker from './color-picker';
import { renderWithProviders } from '../../utils/test-utils';
import { PopoverId } from '../../types';

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

vi.mock('react-map-gl/maplibre', () => {
  const Map = vi.fn();
  const Source = vi.fn();
  return { Map, Source };
});

describe('ColorPicker', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(
      <ColorPicker
        value="#FFFFFF"
        onColorChange={vi.fn()}
        popoverId={PopoverId.VEHICLE_LAYER_3D_COLOR}
        Icon={OpacityIcon}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
