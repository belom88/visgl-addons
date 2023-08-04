import {
  Divider,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

/* eslint-disable-next-line */
export interface ScenePropsProps {
  animationState: boolean;
  vehiclesCount: number;
  vehiclesCountMin: number;
  vehiclesCountMax: number;
  onAnimationStateChange: () => void;
  onVehiclesCountChange: (e: Event, newValue: number | number[]) => void;
}

export function SceneProps({
  animationState,
  vehiclesCount,
  vehiclesCountMin,
  vehiclesCountMax,
  onAnimationStateChange,
  onVehiclesCountChange,
}: ScenePropsProps) {
  return (
    <>
      <Typography variant="h6" component="div">
        Scene Properties
      </Typography>
      <Divider />
      <Stack spacing={2} direction="row" alignItems={'center'}>
        <FormControlLabel
          control={
            <Switch
              checked={animationState}
              onChange={onAnimationStateChange}
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
    </>
  );
}

export default SceneProps;
