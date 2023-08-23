import {
  getNewNotificationId,
  notificationsActions,
  notificationsAdapter,
  notificationsReducer,
} from './notifications.slice';

describe('notifications reducer', () => {
  it('should handle initial state', () => {
    const expected = notificationsAdapter.getInitialState({});

    expect(notificationsReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should add and remove notifications', () => {
    let state = notificationsReducer(
      undefined,
      notificationsActions.add({
        id: getNewNotificationId(),
        severity: 'warning',
        message: 'some message should be here',
      })
    );
    expect(state).toEqual(
      expect.objectContaining({
        entities: {
          0: {
            id: 0,
            severity: 'warning',
            message: 'some message should be here',
          },
        },
      })
    );

    state = notificationsReducer(
      state,
      notificationsActions.add({
        id: getNewNotificationId(),
        severity: 'info',
        message: 'another message',
      })
    );
    state = notificationsReducer(state, notificationsActions.remove(0));
    expect(state).toEqual(
      expect.objectContaining({
        entities: {
          1: {
            id: 1,
            severity: 'info',
            message: 'another message',
          },
        },
      })
    );
  });
});
