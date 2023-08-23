import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
} from '@mui/material';
import { theme } from '../../theme/header-radio-theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectBaseMapMode,
  setBaseMapMode,
} from '../../redux/slices/app.slice';
import { BaseMapMode } from '../../types';

/* eslint-disable-next-line */
export interface BaseMapModeSwitcherProps {}

export function BaseMapModeSwitcher(props: BaseMapModeSwitcherProps) {
  const dispatch = useAppDispatch();
  const baseMapMode = useAppSelector(selectBaseMapMode);

  const onBaseMapChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      setBaseMapMode((event.target as HTMLInputElement).value as BaseMapMode)
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <FormControl>
        <RadioGroup
          row
          name="size-mode-radio-buttons-group"
          value={baseMapMode}
          onChange={onBaseMapChangeHandler}
        >
          <FormControlLabel
            value={BaseMapMode.OVERLAID}
            control={<Radio />}
            label="Overlaid"
          />
          <FormControlLabel
            value={BaseMapMode.INTERLEAVED}
            control={<Radio />}
            label="Interleaved"
          />
        </RadioGroup>
      </FormControl>
    </ThemeProvider>
  );
}

export default BaseMapModeSwitcher;
