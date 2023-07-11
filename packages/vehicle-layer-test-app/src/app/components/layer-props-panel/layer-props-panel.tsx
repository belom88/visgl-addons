import {
  Box,
  Divider,
  Paper,
  Slider,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import {
  layerPropsActions,
  selectVehiclesCount,
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

/* eslint-disable-next-line */
export interface LayerPropsPanelProps {}

export function LayerPropsPanel(props: LayerPropsPanelProps) {
  const vehiclesCount = useAppSelector(selectVehiclesCount);
  const dispatch = useAppDispatch();
  const onVehiclesCountChange = (e: Event, newValue: number | number[]) => {
    dispatch(layerPropsActions.setVehiclesCount(newValue));
  };

  return (
    <StyledContainer>
      <StyledMainPaper elevation={0}>
        <Typography variant="h6" component="div">
          Vehicle Layer Properties
        </Typography>
        <Divider />
        <Typography variant="subtitle1" component="span">
          Number of Vehicles ({vehiclesCount})
        </Typography>
        <Stack spacing={2} direction="row" alignItems={'center'}>
          <Typography variant="body2" component="span">
            10
          </Typography>
          <Slider
            aria-label="Number of Vehicles"
            min={10}
            max={10000}
            step={1}
            value={vehiclesCount}
            onChange={onVehiclesCountChange}
          />
          <Typography variant="body2" component="span">
            10000
          </Typography>
        </Stack>
      </StyledMainPaper>
    </StyledContainer>
  );
}

export default LayerPropsPanel;
