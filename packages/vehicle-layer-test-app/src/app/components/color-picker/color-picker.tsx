import { PropsWithChildren, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { ColorResult } from '@uiw/color-convert';
import Colorful from '@uiw/react-color-colorful';
import * as d3 from 'd3';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { appActions, selectOpenedMenuId } from '../../redux/slices/app.slice';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { PopoverId } from '../../types';

const StyledColorButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.primary,
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    borderRadius: '8px',
  },
}));

const rgbToHex = (rgb?: [number, number, number]): string => {
  if (!rgb) {
    return '#FFF';
  }
  return d3.rgb(...rgb).formatHex();
};

/* eslint-disable-next-line */
export interface ColorPickerProps {
  value?: [number, number, number];
  popoverId: PopoverId;
  Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
  };
  onColorChange: (value: ColorResult) => void;
}

export function ColorPicker({
  value,
  popoverId,
  Icon,
  children,
  onColorChange,
}: PropsWithChildren<ColorPickerProps>) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openedPopoverId = useAppSelector(selectOpenedMenuId);

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(appActions.setOpenedPopoverId(popoverId));
    setAnchorEl(event.currentTarget);
  };

  const onCloseHandler = () => {
    dispatch(appActions.closePopover());
    setAnchorEl(null);
  };

  const hexValue = useMemo(() => rgbToHex(value), [value]);
  const isValueLight = useMemo(() => {
    if (!value) {
      return true;
    }
    return 255 * 3 - value[0] - value[1] - value[2] < 100;
  }, [value]);

  return (
    <>
      <StyledColorButton
        aria-describedby={
          openedPopoverId === popoverId ? `menu-${popoverId}` : undefined
        }
        onClick={onClickHandler}
      >
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Avatar sx={{ bgcolor: hexValue }}>
            <Icon color={isValueLight ? 'primary' : undefined} />
          </Avatar>
          <Typography>{children}</Typography>
        </Stack>
      </StyledColorButton>
      <StyledPopover
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
        slotProps={{ paper: {} }}
      >
        <Colorful disableAlpha color={hexValue} onChange={onColorChange} />
      </StyledPopover>
    </>
  );
}

export default ColorPicker;
