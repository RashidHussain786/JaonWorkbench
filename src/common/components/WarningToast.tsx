import toast from 'react-hot-toast';

(toast as any).warning = (message: string) =>
  toast(message, {
    style: {
      border: '1px solid #facc15',
      padding: '16px',
      color: '#713f12',
    },
    icon: '⚠️',
  });