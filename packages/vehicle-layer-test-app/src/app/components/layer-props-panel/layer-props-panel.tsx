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
import {
  layerPropsActions,
  selectAnimationState,
  selectScale,
  selectVehiclesCountMinMax,
  selectVehiclesCountValue,
} from '../../redux/slices/layer-props.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

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
          <Typography variant="body2" component="span">
            100
          </Typography>
        </Stack>
      </StyledMainPaper>
    </StyledContainer>
  );
}

export default LayerPropsPanel;
