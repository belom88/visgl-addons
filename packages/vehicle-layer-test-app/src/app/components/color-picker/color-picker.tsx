import { PropsWithChildren, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Popover,
  Stack,
  SvgIconTypeMap,
  Typography,
  styled,
} from '@mui/material';
import { ColorResult } from '@uiw/color-convert';
import Colorful from '@uiw/react-color-colorful';
import * as d3 from 'd3';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { appActions, selectOpenedMenuId } from '../../redux/slices/app.slice';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { PopoverId } from '../../types';
import {
  layerPropsActions,
  selectVehicleColor,
} from '../../redux/slices/layer-props.slice';

const StyledColorButton = styled(Button)`
  text-transform: none;
`;

/* eslint-disable-next-line */
export interface ColorPickerProps {
  popoverId: PopoverId;
  Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
  };
}

export function ColorPicker({
  popoverId,
  Icon,
  children,
}: PropsWithChildren<ColorPickerProps>) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openedPopoverId = useAppSelector(selectOpenedMenuId);
  const vehicleColor = useAppSelector((state) =>
    selectVehicleColor(state, popoverId)
  );

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(appActions.setOpenedMenuId(popoverId));
    setAnchorEl(event.currentTarget);
  };

  const onCloseHandler = () => {
    dispatch(appActions.closeMenu());
    setAnchorEl(null);
  };

  const hexColor = useMemo(() => {
    if (!vehicleColor) {
      return '#FFF';
    }
    return d3.rgb(...vehicleColor).formatHex();
  }, [vehicleColor]);

  const onColorChange = (value: ColorResult) => {
    dispatch(
      layerPropsActions.setVehicleColor({
        popoverId,
        color: [value.rgb.r, value.rgb.g, value.rgb.b],
      })
    );
  };

  return (
    <>
      <StyledColorButton
        aria-describedby={
          openedPopoverId === popoverId ? `menu-${popoverId}` : undefined
        }
        color="secondary"
        onClick={onClickHandler}
      >
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Avatar sx={{ bgcolor: hexColor }}>
            <Icon />
          </Avatar>
          <Typography>{children}</Typography>
        </Stack>
      </StyledColorButton>
      <Popover
        id={`menu-${popoverId}`}
        anchorEl={anchorEl}
        open={openedPopoverId === popoverId}
        onClose={onCloseHandler}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Colorful color={hexColor} onChange={onColorChange} />
      </Popover>
    </>
  );
}

export default ColorPicker;
