import { useMemo } from 'react';
import { Box, Paper, Tab, Tabs, styled } from '@mui/material';

import {
  layerPropsActions,
  selectAnimationState,
  selectDimensionMode,
  selectPickableState,
  selectScale,
  selectSize,
  selectSizeMode,
  selectUseCase,
  selectVehicleColor,
  selectVehiclesCountMinMax,
  selectVehiclesCountValue,
} from '../../redux/slices/layer-props.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import SceneProps from './scene-props/scene-props';
import VehicleLayerProps from './vehicle-layer-props/vehicle-layer-props';
import { PopoverId, UseCaseId } from '../../types';
import * as d3 from 'd3';
import { SizeMode } from '@belom88/vehicle-layer';
import { StyledBottomRightContainer, StyledMainPaper } from '../common-styled';

const StyledContentContainer = styled(Box)`
  max-height: calc(100vh - 200px);
  overflow: auto;
  padding: 0 1em;
`;

const rgbToHex = (rgb?: [number, number, number]): string => {
  if (!rgb) {
    return '#FFF';
  }
  return d3.rgb(...rgb).formatHex();
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

/* eslint-disable-next-line */
export interface LayerPropsPanelProps {}

export function LayerPropsPanel(props: LayerPropsPanelProps) {
  const useCase = useAppSelector(selectUseCase);
  const vehiclesCount = useAppSelector(selectVehiclesCountValue);
  const [vehiclesCountMin, vehiclesCountMax] = useAppSelector(
    selectVehiclesCountMinMax
  );
  const sizeMode = useAppSelector(selectSizeMode);
  const size = useAppSelector(selectSize);
  const vehicleScale = useAppSelector(selectScale);
  const animationState = useAppSelector(selectAnimationState);
  const pickableState = useAppSelector(selectPickableState);
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

  const onTabChangeHandler = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    dispatch(layerPropsActions.setUseCase(newValue));
  };

  return (
    <StyledBottomRightContainer sx={{ display: { xs: 'none', sm: 'block' } }}>
      <StyledMainPaper elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={useCase}
            onChange={onTabChangeHandler}
            aria-label="basic tabs example"
          >
            <Tab label="SF" value={UseCaseId.SF_TRANSIT} {...a11yProps(0)} />
            <Tab label="Anfield" value={UseCaseId.ANFIELD} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <StyledContentContainer>
          {useCase === UseCaseId.SF_TRANSIT && (
            <SceneProps
              animationState={animationState}
              pickableState={pickableState}
              vehiclesCount={vehiclesCount}
              vehiclesCountMin={vehiclesCountMin}
              vehiclesCountMax={vehiclesCountMax}
              onAnimationStateChange={() =>
                dispatch(layerPropsActions.toggleAnimation())
              }
              onPickingChange={() =>
                dispatch(layerPropsActions.togglePicking())
              }
              onVehiclesCountChange={onVehiclesCountChange}
            />
          )}
          <VehicleLayerProps
            sizeMode={sizeMode}
            size={size}
            vehicleScale={vehicleScale}
            dimensionMode={dimensionMode}
            commonHexColor={commonHexColor}
            d3HexColor={d3HexColor}
            d2ForegroundHexColor={d2ForegroundHexColor}
            d2BackgroundHexColor={d2BackgroundHexColor}
            onSizeModeChange={(result: SizeMode) =>
              dispatch(layerPropsActions.setSizeMode(result))
            }
            onSizeChange={(value: number) =>
              dispatch(layerPropsActions.setSize(value))
            }
            onScaleChange={(value: number) =>
              dispatch(layerPropsActions.setScale(value))
            }
            onDimensionModeChange={() =>
              dispatch(layerPropsActions.toggleDimensionMode())
            }
            onColorChange={onColorChangeHandler}
          />
        </StyledContentContainer>
      </StyledMainPaper>
    </StyledBottomRightContainer>
  );
}

export default LayerPropsPanel;
