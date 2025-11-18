import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  const showError = (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  const showInfo = (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
    });
  };

  const showWarning = (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};