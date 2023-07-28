import {
  Box,
  Divider,
  FormControlLabel,
  Paper,
  Slider,
  Stack,
  Switch,
  Typography,
  styled,
} from '@mui/material';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import OpacityIcon from '@mui/icons-material/Opacity';
import {
  layerPropsActions,
  selectAnimationState,
  selectDimensionMode,
  selectScale,
  selectVehiclesCountMinMax,
  selectVehiclesCountValue,
} from '../../redux/slices/layer-props.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import ColorPicker from '../color-picker/color-picker';
import { PopoverId } from '../../types';

const StyledContainer = styled(Box)`
  bottom: 1.5em;
  right: 0.5em;
  width: 40rem;
  position: absolute;
  z-index: 1;
`;

const StyledMainPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)};
  textalign: 'center';
`;

const calculateScale = (value: number) => {
  if (value < 50) {
    return value / 25;
  } else {
    return (value - 49) * 2;
  }
};
const calculateUnscale = (value: number) => {
  if (value < 2) {
    return value * 25;
  } else {
    return 50 + value / 2;
  }
};

/* eslint-disable-next-line */
export interface LayerPropsPanelProps {}

export function LayerPropsPanel(props: LayerPropsPanelProps) {
  const vehiclesCount = useAppSelector(selectVehiclesCountValue);
  const [vehiclesCountMin, vehiclesCountMax] = useAppSelector(
    selectVehiclesCountMinMax
  );
  const vehicleScale = useAppSelector(selectScale);
  const animationState = useAppSelector(selectAnimationState);
  const dimensionMode = useAppSelector(selectDimensionMode);
  const dispatch = useAppDispatch();

  const onVehiclesCountChange = (e: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      dispatch(layerPropsActions.setVehiclesCount(newValue));
    }
  };

  const onScaleChange = (e: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      dispatch(layerPropsActions.setScale(calculateScale(newValue)));
    }
  };

  return (
    <StyledContainer sx={{ display: { xs: 'none', sm: 'block' } }}>
      <StyledMainPaper elevation={2}>
        <Typography variant="h6" component="div">
          Scene Properties
        </Typography>
        <Divider />
        <Stack spacing={2} direction="row" alignItems={'center'}>
          <FormControlLabel
            control={
              <Switch
                checked={animationState}
                onChange={() => dispatch(layerPropsActions.toggleAnimation())}
              />
            }
            label="Animation"
          />
        </Stack>
        <Typography variant="subtitle1" component="span">
          Number of Vehicles ({vehiclesCount})
        </Typography>
        <Stack spacing={2} direction="row" alignItems={'center'}>
          <Typography variant="body2" component="span">
            {vehiclesCountMin}
          </Typography>
          <Slider
            aria-label="Number of Vehicles"
            min={vehiclesCountMin}
            max={vehiclesCountMax}
            step={1}
            value={vehiclesCount}
            onChange={onVehiclesCountChange}
          />
          <Typography variant="body2" component="span">
            {vehiclesCountMax}
          </Typography>
        </Stack>
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
            onChange={onScaleChange}
          />
        </Stack>
        <Stack direction="row" alignItems={'center'}>
          <Typography variant="body2" component="span">
            2D
          </Typography>
          <Switch
            checked={dimensionMode === '2D' ? false : true}
            onChange={() => dispatch(layerPropsActions.toggleDimensionMode())}
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
            useColor
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
      </StyledMainPaper>
    </StyledContainer>
  );
}

export default LayerPropsPanel;
