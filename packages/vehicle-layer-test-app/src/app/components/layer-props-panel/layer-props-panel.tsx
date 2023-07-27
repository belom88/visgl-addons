import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Paper,
  Slider,
  Stack,
  Switch,
  Typography,
  Avatar,
  styled,
  Popover,
} from '@mui/material';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import {
  layerPropsActions,
  selectAnimationState,
  selectDimentionalMode,
  selectScale,
  selectVehiclesCountMinMax,
  selectVehiclesCountValue,
} from '../../redux/slices/layer-props.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { appActions, selectOpenedMenuId } from '../../redux/slices/app.slice';
import { MenuId } from '../../types';
import Colorful from '@uiw/react-color-colorful';
import { green } from '@mui/material/colors';
import { useRef, useState } from 'react';

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
  const dimentionalMode = useAppSelector(selectDimentionalMode);
  const openedMenuId = useAppSelector(selectOpenedMenuId);
  const dispatch = useAppDispatch();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(appActions.setOpenedMenuId(MenuId.VEHICLE_LAYER_COMMON_COLOR));
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    dispatch(appActions.closeMenu());
    setAnchorEl(null);
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
            checked={dimentionalMode === '2D' ? false : true}
            onChange={() => dispatch(layerPropsActions.toggleDimentionalMode())}
          />
          <Typography variant="body2" component="span">
            3D
          </Typography>
        </Stack>
        <Stack direction="row" alignItems={'center'}>
          <div>
            <Button
              aria-describedby={
                openedMenuId === MenuId.VEHICLE_LAYER_COMMON_COLOR
                  ? `menu-${MenuId.VEHICLE_LAYER_COMMON_COLOR}`
                  : undefined
              }
              ref={anchorRef}
              onClick={handleClick}
            >
              <Avatar sx={{ bgcolor: green[500] }}>
                <ColorLensOutlinedIcon />
              </Avatar>
            </Button>
            <Popover
              id={`menu-${MenuId.VEHICLE_LAYER_COMMON_COLOR}`}
              anchorEl={anchorEl}
              open={openedMenuId === MenuId.VEHICLE_LAYER_COMMON_COLOR}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Colorful />
            </Popover>
          </div>
        </Stack>
      </StyledMainPaper>
    </StyledContainer>
  );
}

export default LayerPropsPanel;
