import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Clock, Check, Minus, CircleHelp, XCircle } from 'lucide-react';
import type { NotificationType } from '@/store/notifications';

const colorScheme = {
  info: {
    icon: <Clock className="h-5 w-5 text-blue-400" aria-hidden="true" />,
    body: 'bg-blue-100 border border-blue-300/50',
  },
  success: {
    icon: <Check className="h-5 w-5 text-success-400" aria-hidden="true" />,
    body: 'bg-green-100 border border-green-300/50',
  },
  warning: {
    icon: <CircleHelp className="h-5 w-5 text-warning-500" aria-hidden="true" />,
    body: 'bg-yellow-300 border border-warning-300/50',
  },
  error: {
    icon: <Minus className="h-5 w-5 text-danger-500" aria-hidden="true" />,
    body: 'bg-red-200 border border-red-300/50',
  },
};

export type NotificationProps = {
  notification: NotificationType;

  options: Partial<{
    duration: number;
  }>;
  onDismiss: (id: string) => void;
};

const positionClass = {
  right: 'sm:items-end',
  center: 'sm:items-center',
  left: 'sm:items-start',
};

export const Notification = ({
  notification: { id, type = 'info', title, message, position = 'right' },
  options: { duration },
  onDismiss,
}: NotificationProps) => {
  const [show, setShow] = useState(true);
  const [ariaLabel, setAriaLabel] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, id, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, (duration as number) + 600);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, id, onDismiss]);

  const handleDismiss = () => {
    setShow(false);
    setTimeout(() => {
      onDismiss(id);
    }, 400);
  };

  useEffect(() => {
    switch (type) {
      case 'error':
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAriaLabel('Error');
        break;
      case 'info':
        setAriaLabel('Info');
        break;
      case 'success':
        setAriaLabel('Success');
        break;
      case 'warning':
        setAriaLabel('Warning');
        break;
      default:
        setAriaLabel('Alert');
    }
  }, [type]);

  return (
    <Transition
      appear={true}
      // as={Fragment}
      show={show}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-x-4 opacity-0"
      enterTo="translate-x-0 opacity-100"
      leave="transition ease-in duration-300"
      leaveFrom="opacity-100 -translate-x-2"
      leaveTo="opacity-0 translate-x-6"
    >
      <div className={clsx('w-full flex flex-col items-center space-y-4', positionClass[position])}>
        <div
          className={clsx(
            'max-w-sm w-full rounded-lg pointer-events-auto overflow-hidden',
            colorScheme[type].body
          )}
        >
          <div className="p-3" role="alert" aria-label={ariaLabel}>
            <div className="flex items-start">
              <div className="flex-shrink-0 pr-2">{colorScheme[type].icon}</div>
              <div className="w-0 flex-1">
                {title && <h1 className="text-sm font-semibold text-gray-800 pb-1">{title}</h1>}

                {typeof message === 'string' && message.split('\n').length > 2 ? (
                  <ul className="list-inside text-[13px] text-gray-600 font-medium list-disc">
                    {message.split('\n').map((x) => {
                      return <li key={x}>{x}</li>;
                    })}
                  </ul>
                ) : (
                  <p className="text-[13px] text-gray-600 font-medium">{message}</p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="border-gray-700 text-gray-800 hover:bg-gray-200 transition-colors rounded-full p-1 "
                  onClick={handleDismiss}
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};