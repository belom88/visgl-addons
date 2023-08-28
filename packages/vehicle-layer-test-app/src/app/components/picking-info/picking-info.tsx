import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  StyledGridContainer,
  StyledGridItem,
  StyledMainPaper,
  StyledTopPanelsContainer,
} from '../common-styled';
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
    <StyledTopPanelsContainer
      sx={{
        top: { xs: '0.5em', sm: '0.5em', md: 'initial' },
        bottom: { xs: 'initial', sm: 'initial', md: '1.5em' },
        right: { xs: 'initial', sm: 'initial', md: '0.5em' },
        left: { xs: '0.5em', sm: '0.5em', md: 'initial' },
      }}
    >
      <Toolbar />
      <StyledGridContainer
        container
        spacing={2}
        justifyContent={'flex-end'}
        alignItems={'flex-end'}
      >
        <StyledGridItem item md={4} sm={7} xs={12}>
          <StyledMainPaper
            elevation={2}
            bgcolor={routeColor}
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
        </StyledGridItem>
      </StyledGridContainer>
    </StyledTopPanelsContainer>
  );
}

export default PickingInfo;
