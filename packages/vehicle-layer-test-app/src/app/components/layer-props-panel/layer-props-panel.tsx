import {
  Box,
  Divider,
  Paper,
  Slider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import styled from 'styled-components';

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
  const theme = useTheme();

  const calculateValue = (value: number) => {
    return 2 ** value;
  };

  const onVehiclesCountChange = (e: Event, newValue: number | number[]) => {
    console.log(newValue);
  };

  return (
    <StyledContainer>
      <StyledMainPaper elevation={0} theme={theme}>
        <Typography variant="h6" component="div">
          Vehicle Layer Properties
        </Typography>
        <Divider />
        <Typography variant="subtitle1" component="span">
          Number of Vehicles
        </Typography>
        <Stack spacing={2} direction="row" alignItems={'center'}>
          <Typography variant="body2" component="span">
            10
          </Typography>
          <Slider
            aria-label="Volume"
            min={10}
            max={10000}
            step={1}
            // scale={calculateValue}
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
