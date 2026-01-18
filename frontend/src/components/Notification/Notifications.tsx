import { Portal } from '@headlessui/react';

import { Notification } from './Notification';
import { useNotificationActions, useNotificationList } from '@/store/notifications';

type Props = {
  options: Partial<{
    duration: number;
  }>;
};

export const Notifications = (props: Props) => {
  const notifications = useNotificationList();
  const { remove } = useNotificationActions();
  if (notifications.length > 0)
    return (
      <Portal refName="notification">
        <div
          aria-live="assertive"
          className="z-50 flex flex-col fixed inset-0 gap-2 items-end px-4 py-6 pointer-events-none sm:p-6 xs:items-end"
        >
          {notifications.map((notification) => (
            <Notification
              options={props.options}
              key={notification.id}
              notification={notification}
              onDismiss={remove}
            />
          ))}
        </div>
      </Portal>
    );
  return null;
};