import {
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import OpacityIcon from '@mui/icons-material/Opacity';
import { ColorResult } from '@uiw/color-convert';
import ColorPicker from '../../color-picker/color-picker';
import { PopoverId } from '../../../types';
import { SizeMode } from '@belom88/vehicle-layer';

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
  sizeMode: SizeMode;
  size: number;
  vehicleScale: number;
  dimensionMode: '2D' | '3D';
  commonHexColor: string;
  d3HexColor: string;
  d2ForegroundHexColor: string;
  d2BackgroundHexColor: string;
  onSizeModeChange: (value: SizeMode) => void;
  onSizeChange: (value: number) => void;
  onScaleChange: (value: number) => void;
  onDimensionModeChange: () => void;
  onColorChange: (
    value: [number, number, number],
    popoverId: PopoverId
  ) => void;
}

export function VehicleLayerProps({
  sizeMode,
  size,
  vehicleScale,
  dimensionMode,
  commonHexColor,
  d3HexColor,
  d2ForegroundHexColor,
  d2BackgroundHexColor,
  onSizeModeChange,
  onSizeChange,
  onScaleChange,
  onDimensionModeChange,
  onColorChange,
}: VehicleLayerPropsProps) {
  const onScaleChangeHandler = (e: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      onScaleChange(calculateScale(newValue));
    }
  };

  const onColorChangeHandler = (value: ColorResult, popoverId: PopoverId) =>
    onColorChange([value.rgb.r, value.rgb.g, value.rgb.b], popoverId);

  const onSizeModeChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) =>
    onSizeModeChange(
      parseInt((event.target as HTMLInputElement).value) as SizeMode
    );

  const onSizeChangeHandler = (e: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      onSizeChange(newValue);
    }
  };

  return (
    <>
      <Typography variant="h6" component="div">
        VehicleLayer Properties
      </Typography>
      <Divider />
      <Typography variant="subtitle1" component="span">
        Size
      </Typography>
      <Stack direction="row" alignItems={'center'}>
        <FormControl>
          <RadioGroup
            row
            name="size-mode-radio-buttons-group"
            value={sizeMode}
            onChange={onSizeModeChangeHandler}
          >
            <FormControlLabel
              value={SizeMode.Original}
              control={<Radio />}
              label="Original"
            />
            <FormControlLabel
              value={SizeMode.Pixel}
              control={<Radio />}
              label="Pixel"
            />
            <FormControlLabel
              value={SizeMode.Combined}
              control={<Radio />}
              label="Combined"
            />
          </RadioGroup>
        </FormControl>
      </Stack>
      {((sizeMode !== SizeMode.Original && dimensionMode === '2D') ||
        sizeMode === SizeMode.Pixel) && (
        <>
          <Typography variant="subtitle1" component="span">
            Pixel Size ({size})
          </Typography>
          <Stack spacing={2} direction="row" alignItems={'center'}>
            <Typography variant="body2" component="span">
              {1}
            </Typography>
            <Slider
              aria-label="Pixel Size"
              min={1}
              max={1000}
              step={1}
              value={size}
              onChange={onSizeChangeHandler}
            />
            <Typography variant="body2" component="span">
              {1000}
            </Typography>
          </Stack>{' '}
        </>
      )}
      {((dimensionMode === '3D' && sizeMode !== SizeMode.Pixel) ||
        (dimensionMode === '2D' && sizeMode === SizeMode.Original)) && (
        <>
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
            <Typography variant="body2" component="span">
              100
            </Typography>
          </Stack>
        </>
      )}
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
          value={commonHexColor}
          popoverId={PopoverId.VEHICLE_LAYER_COMMON_COLOR}
          Icon={ColorLensOutlinedIcon}
          onColorChange={(value: ColorResult) =>
            onColorChangeHandler(value, PopoverId.VEHICLE_LAYER_COMMON_COLOR)
          }
        >
          getColor
        </ColorPicker>
        {dimensionMode === '2D' && (
          <>
            <ColorPicker
              value={d2ForegroundHexColor}
              popoverId={PopoverId.VEHICLE_LAYER_2D_FOREGROUND}
              Icon={OpacityIcon}
              onColorChange={(value: ColorResult) =>
                onColorChangeHandler(
                  value,
                  PopoverId.VEHICLE_LAYER_2D_FOREGROUND
                )
              }
            >
              get2dForegroundColor
            </ColorPicker>
            <ColorPicker
              value={d2BackgroundHexColor}
              popoverId={PopoverId.VEHICLE_LAYER_2D_BACKGROUND}
              Icon={FormatColorFillIcon}
              onColorChange={(value: ColorResult) =>
                onColorChangeHandler(
                  value,
                  PopoverId.VEHICLE_LAYER_2D_BACKGROUND
                )
              }
            >
              get2dBackgroundColor
            </ColorPicker>
          </>
        )}
        {dimensionMode === '3D' && (
          <ColorPicker
            value={d3HexColor}
            popoverId={PopoverId.VEHICLE_LAYER_3D_COLOR}
            Icon={OpacityIcon}
            onColorChange={(value: ColorResult) =>
              onColorChangeHandler(value, PopoverId.VEHICLE_LAYER_3D_COLOR)
            }
          >
            get3dColor
          </ColorPicker>
        )}
      </Stack>
    </>
  );
}

export default VehicleLayerProps;
