import { Divider, Slider, Stack, Switch, Typography } from '@mui/material';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import OpacityIcon from '@mui/icons-material/Opacity';
import ColorPicker from '../../color-picker/color-picker';
import { PopoverId } from '../../../types';

const calculateScale = (value: number): number => {
  if (value < 50) {
    return value / 25;
  } else {
    return (value - 49) * 2;
  }
};
const calculateUnscale = (value: number): number => {
  if (value < 2) {
    return value * 25;
  } else {
    return 50 + value / 2;
  }
};

/* eslint-disable-next-line */
export interface VehicleLayerPropsProps {
  vehicleScale: number;
  dimensionMode: '2D' | '3D';
  onScaleChange: (value: number) => void;
  onDimensionModeChange: () => void;
}

export function VehicleLayerProps({
  vehicleScale,
  dimensionMode,
  onScaleChange,
  onDimensionModeChange,
}: VehicleLayerPropsProps) {
  const onScaleChangeHandler = (e: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      onScaleChange(calculateScale(newValue));
    }
  };

  return (
    <>
      <Typography variant="h6" component="div">
        VehicleLayer Properties
      </Typography>
      <Divider />
      <Typography variant="subtitle1" component="span">
        Scale ({vehicleScale.toFixed(3)})
      </Typography>
      <Stack spacing={2} direction="row" alignItems={'center'}>
        <Typography variant="body2" component="span">
          0.1
        </Typography>
        <Slider
          aria-label="Vehicle Scale"
          min={0.1}
          max={99}
          step={0.1}
          scale={calculateScale}
          value={calculateUnscale(vehicleScale)}
          onChange={onScaleChangeHandler}
        />
      </Stack>
      <Stack direction="row" alignItems={'center'}>
        <Typography variant="body2" component="span">
          2D
        </Typography>
        <Switch
          checked={dimensionMode === '2D' ? false : true}
          onChange={onDimensionModeChange}
        />
        <Typography variant="body2" component="span">
          3D
        </Typography>
      </Stack>
      <Stack direction="row" alignItems={'center'}>
        <ColorPicker
          popoverId={PopoverId.VEHICLE_LAYER_COMMON_COLOR}
          Icon={ColorLensOutlinedIcon}
        >
          getColor
        </ColorPicker>
        {dimensionMode === '2D' && (
          <>
            <ColorPicker
              popoverId={PopoverId.VEHICLE_LAYER_2D_FOREGROUND}
              Icon={OpacityIcon}
            >
              get2dForegroundColor
            </ColorPicker>
            <ColorPicker
              popoverId={PopoverId.VEHICLE_LAYER_2D_BACKGROUND}
              Icon={FormatColorFillIcon}
            >
              get2dBackgroundColor
            </ColorPicker>
          </>
        )}
        {dimensionMode === '3D' && (
          <ColorPicker
            popoverId={PopoverId.VEHICLE_LAYER_3D_COLOR}
            Icon={OpacityIcon}
          >
            get3dColor
          </ColorPicker>
        )}
      </Stack>
    </>
  );
}

export default VehicleLayerProps;
