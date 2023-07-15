import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
} from '@mui/material';
import { theme } from '../../theme/header-radio-theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { appActions, selectBaseMapMode } from '../../redux/slices/app.slice';
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
      appActions.setBaseMapMode(
        (event.target as HTMLInputElement).value as BaseMapMode
      )
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <FormControl>
        <RadioGroup
          row
          name="row-radio-buttons-group"
          value={baseMapMode}
          onChange={onBaseMapChangeHandler}
        >
          <FormControlLabel
            value={BaseMapMode.OVERLAPPED}
            control={<Radio />}
            label="Overlapped"
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
