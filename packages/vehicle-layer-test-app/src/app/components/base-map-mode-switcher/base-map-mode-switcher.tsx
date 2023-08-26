import { Fragment, useMemo } from 'react';
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
export interface BaseMapModeSwitcherProps {
  useDarkTheme?: boolean;
  direction?: 'row' | 'column';
}

export function BaseMapModeSwitcher({
  useDarkTheme = true,
  direction = 'row',
}: BaseMapModeSwitcherProps) {
  const dispatch = useAppDispatch();
  const baseMapMode = useAppSelector(selectBaseMapMode);

  const onBaseMapChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      setBaseMapMode((event.target as HTMLInputElement).value as BaseMapMode)
    );
  };

  const ThemeWrapper = useMemo(() => {
    if (useDarkTheme) {
      return ThemeProvider;
    }
    return Fragment;
  }, [useDarkTheme]);

  const renderForm = () => (
    <FormControl>
      <RadioGroup
        row={direction === 'row'}
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
  );

  const form = renderForm();
  if (useDarkTheme) {
    return <ThemeWrapper theme={theme}>{form}</ThemeWrapper>;
  } else {
    return form;
  }
}

export default BaseMapModeSwitcher;
