export const getStatusIcon = (status) => {
  const icons = {
    online: '🟢',
    offline: '🔴',
  };
  return icons[status] || '⚪';
};

export const getStatusLabel = (status) => {
  return status === 'online' ? 'Online' : 'Offline';
};
