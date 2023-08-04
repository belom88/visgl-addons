import { useMemo } from 'react';
import { Box, Paper, styled } from '@mui/material';

import {
  layerPropsActions,
  selectAnimationState,
  selectDimensionMode,
  selectScale,
  selectVehicleColor,
  selectVehiclesCountMinMax,
  selectVehiclesCountValue,
} from '../../redux/slices/layer-props.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import SceneProps from './scene-props/scene-props';
import VehicleLayerProps from './vehicle-layer-props/vehicle-layer-props';
import { PopoverId } from '../../types';
import * as d3 from 'd3';

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

const rgbToHex = (rgb?: [number, number, number]): string => {
  if (!rgb) {
    return '#FFF';
  }
  return d3.rgb(...rgb).formatHex();
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

  const vehicleCommonColor = useAppSelector((state) =>
    selectVehicleColor(state, PopoverId.VEHICLE_LAYER_COMMON_COLOR)
  );
  const commonHexColor = useMemo(
    () => rgbToHex(vehicleCommonColor),
    [vehicleCommonColor]
  );

  const vehicle3dColor = useAppSelector((state) =>
    selectVehicleColor(state, PopoverId.VEHICLE_LAYER_3D_COLOR)
  );
  const d3HexColor = useMemo(() => rgbToHex(vehicle3dColor), [vehicle3dColor]);

  const vehicle2dForegroundColor = useAppSelector((state) =>
    selectVehicleColor(state, PopoverId.VEHICLE_LAYER_2D_FOREGROUND)
  );
  const d2ForegroundHexColor = useMemo(
    () => rgbToHex(vehicle2dForegroundColor),
    [vehicle2dForegroundColor]
  );

  const vehicle2dBackgroundColor = useAppSelector((state) =>
    selectVehicleColor(state, PopoverId.VEHICLE_LAYER_2D_BACKGROUND)
  );
  const d2BackgroundHexColor = useMemo(
    () => rgbToHex(vehicle2dBackgroundColor),
    [vehicle2dBackgroundColor]
  );

  const dispatch = useAppDispatch();

  const onVehiclesCountChange = (e: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      dispatch(layerPropsActions.setVehiclesCount(newValue));
    }
  };

  const onColorChangeHandler = (
    color: [number, number, number],
    popoverId: PopoverId
  ) => {
    dispatch(
      layerPropsActions.setVehicleColor({
        popoverId,
        color,
      })
    );
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
          commonHexColor={commonHexColor}
          d3HexColor={d3HexColor}
          d2ForegroundHexColor={d2ForegroundHexColor}
          d2BackgroundHexColor={d2BackgroundHexColor}
          onScaleChange={(value: number) =>
            dispatch(layerPropsActions.setScale(value))
          }
          onDimensionModeChange={() =>
            dispatch(layerPropsActions.toggleDimensionMode())
          }
          onColorChange={onColorChangeHandler}
        />
      </StyledMainPaper>
    </StyledContainer>
  );
}

export default LayerPropsPanel;
