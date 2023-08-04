import { PropsWithChildren, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { appActions, selectOpenedMenuId } from '../../redux/slices/app.slice';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { PopoverId } from '../../types';

const StyledColorButton = styled(Button)`
  text-transform: none;
`;

/* eslint-disable-next-line */
export interface ColorPickerProps {
  value: string;
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
          <Avatar sx={{ bgcolor: value }}>
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
        <Colorful color={value} onChange={onColorChange} />
      </Popover>
    </>
  );
}

export default ColorPicker;
