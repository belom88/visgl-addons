import { Box, Paper, styled } from '@mui/material';

import {
  layerPropsActions,
  selectAnimationState,
  selectDimensionMode,
  selectScale,
  selectVehiclesCountMinMax,
  selectVehiclesCountValue,
} from '../../redux/slices/layer-props.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import SceneProps from './scene-props/scene-props';
import VehicleLayerProps from './vehicle-layer-props/vehicle-layer-props';

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

  return (
    <StyledContainer sx={{ display: { xs: 'none', sm: 'block' } }}>
      <StyledMainPaper elevation={2}>
        <SceneProps
          animationState={animationState}
          vehiclesCount={vehiclesCount}
          vehiclesCountMin={vehiclesCountMin}
          vehiclesCountMax={vehiclesCountMax}
          onAnimationStateChange={() =>
            dispatch(layerPropsActions.toggleAnimation())
          }
          onVehiclesCountChange={onVehiclesCountChange}
        />
        <VehicleLayerProps
          vehicleScale={vehicleScale}
          dimensionMode={dimensionMode}
          onScaleChange={(value: number) =>
            dispatch(layerPropsActions.setScale(value))
          }
          onDimensionModeChange={() =>
            dispatch(layerPropsActions.toggleDimensionMode())
          }
        />
      </StyledMainPaper>
    </StyledContainer>
  );
}

export default LayerPropsPanel;
