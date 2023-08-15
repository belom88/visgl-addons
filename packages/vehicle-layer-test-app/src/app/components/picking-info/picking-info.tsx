import { IconButton, Stack, Typography } from '@mui/material';
import { StyledBottomRightContainer, StyledMainPaper } from '../common-styled';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { appActions, selectPikckingData } from '../../redux/slices/app.slice';
import { Vehicle } from '../../utils/vehicles-utils';
import { useCallback, useMemo } from 'react';

/* eslint-disable-next-line */
export interface PickingInfoProps {}

export function PickingInfo(props: PickingInfoProps) {
  const dispatch = useAppDispatch();
  const pickingData = useAppSelector(selectPikckingData);

  const renderRouteNumber = useCallback(() => {
    return (
      pickingData && (
        <Typography variant="h5" component="h5">
          {pickingData.routeLongName} ({pickingData.routeShortName})
        </Typography>
      )
    );
  }, [pickingData]);

  const renderPickingData = (vehicle: Vehicle) => {
    return (
      <Typography variant="body1" component={'div'}>
        {vehicle.routeDesc}
      </Typography>
    );
  };

  const routeColor = useMemo(() => {
    if (pickingData) {
      return `#${pickingData.routeColor}`;
    }
    return '#FFF';
  }, [pickingData]);

  const routeTextColor = useMemo(() => {
    if (pickingData) {
      return `#${pickingData.routeTextColor}`;
    }
    return '#FFF';
  }, [pickingData]);

  return (
    <StyledBottomRightContainer>
      <StyledMainPaper
        elevation={2}
        bgColor={routeColor}
        color={routeTextColor}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          {renderRouteNumber()}
          <IconButton
            aria-label="close"
            onClick={() => dispatch(appActions.resetPickingData())}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Stack>
        {pickingData && renderPickingData(pickingData)}
      </StyledMainPaper>
    </StyledBottomRightContainer>
  );
}

export default PickingInfo;
