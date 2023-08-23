import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  NotificationsEntity,
  notificationsActions,
  selectAllNotifications,
} from '../../redux/slices/notifications.slice';
import { Alert, Snackbar, styled } from '@mui/material';

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '&.MuiSnackbar-anchorOriginTopRight': {
    top: '70px',
  },
}));

/* eslint-disable-next-line */
export interface NotificationsProps {}

export function Notifications(props: NotificationsProps) {
  const dispatch = useAppDispatch();
  const notifications: NotificationsEntity[] = useAppSelector(
    selectAllNotifications
  );

  const closeSnackHandler = (id: number) => {
    dispatch(notificationsActions.remove(id));
  };

  return (
    <>
      {notifications.map((notification: NotificationsEntity) => {
        return (
          <StyledSnackbar
            key={notification.id}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={true}
            autoHideDuration={null}
            onClose={() => closeSnackHandler(notification.id)}
          >
            <Alert
              onClose={() => closeSnackHandler(notification.id)}
              severity={notification.severity}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </StyledSnackbar>
        );
      })}
    </>
  );
}

export default Notifications;
