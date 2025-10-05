import { notifications } from '@mantine/notifications';

export function ENotify(type: 'success' | 'warning', message: string) {
  notifications.show({
    title: type === 'success' ? 'Success' : 'Failure',
    message,
    color: type === 'success' ? 'green' : 'red',
  });
}
