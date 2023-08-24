import { useMemo } from 'react';
import { Box, Tab, Tabs, styled } from '@mui/material';

import {
  layerPropsActions,
  selectAnimationState,
  selectDimensionMode,
  selectPickableState,
  selectScale,
  selectSize,
  selectSizeMode,
  selectTerrainState,
  selectUseCase,
  selectVehicleColor,
  selectVehiclesCountMinMax,
  selectVehiclesCountValue,
  toggleTerrain,
} from '../../redux/slices/layer-props.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import SceneProps from './scene-props/scene-props';
import VehicleLayerProps from './vehicle-layer-props/vehicle-layer-props';
import { PopoverId, UseCaseId } from '../../types';
import { SizeMode } from '@belom88/vehicle-layer';
import { StyledBottomRightContainer, StyledMainPaper } from '../common-styled';
import { selectMapProvider } from '../../redux/slices/app.slice';
import { BaseMapProviderId } from '../../constants/base-map-providers';

const StyledContentContainer = styled(Box)`
  max-height: calc(100vh - 200px);
  overflow: auto;
  padding: 0 1em;
`;

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
  const terrainState = useAppSelector(selectTerrainState);
  const dimensionMode = useAppSelector(selectDimensionMode);
  const baseMapProvider = useAppSelector(selectMapProvider);

  const vehicleCommonColor = useAppSelector((state) =>
    selectVehicleColor(state, PopoverId.VEHICLE_LAYER_COMMON_COLOR)
  );
  const vehicle3dColor = useAppSelector((state) =>
    selectVehicleColor(state, PopoverId.VEHICLE_LAYER_3D_COLOR)
  );
  const vehicle2dForegroundColor = useAppSelector((state) =>
    selectVehicleColor(state, PopoverId.VEHICLE_LAYER_2D_FOREGROUND)
  );
  const vehicle2dBackgroundColor = useAppSelector((state) =>
    selectVehicleColor(state, PopoverId.VEHICLE_LAYER_2D_BACKGROUND)
  );

  const disableTerrain = useMemo(
    () =>
      baseMapProvider.id === BaseMapProviderId.googleMaps ||
      baseMapProvider.id === BaseMapProviderId.arcgis,
    [baseMapProvider]
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
          {
            <SceneProps
              useCase={useCase}
              animationState={animationState}
              pickableState={pickableState}
              terrainState={terrainState}
              disableTerrain={disableTerrain}
              vehiclesCount={vehiclesCount}
              vehiclesCountMin={vehiclesCountMin}
              vehiclesCountMax={vehiclesCountMax}
              onAnimationStateChange={() =>
                dispatch(layerPropsActions.toggleAnimation())
              }
              onPickingChange={() =>
                dispatch(layerPropsActions.togglePicking())
              }
              onTerrainStateChange={() => dispatch(toggleTerrain())}
              onVehiclesCountChange={onVehiclesCountChange}
            />
          }
          <VehicleLayerProps
            sizeMode={sizeMode}
            size={size}
            vehicleScale={vehicleScale}
            dimensionMode={dimensionMode}
            vehicleCommonColor={vehicleCommonColor}
            vehicle3dColor={vehicle3dColor}
            vehicle2dForegroundColor={vehicle2dForegroundColor}
            vehicle2dBackgroundColor={vehicle2dBackgroundColor}
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
