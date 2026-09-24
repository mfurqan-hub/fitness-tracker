export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatWeight = (kg, unit = 'kg') => {
  if (kg === null || kg === undefined) return 'N/A';
  if (unit === 'lbs') {
    return `${(kg * 2.20462).toFixed(1)} lbs`;
  }
  return `${Number(kg).toFixed(1)} kg`;
};

export const formatHeight = (cm, unit = 'cm') => {
  if (cm === null || cm === undefined) return 'N/A';
  if (unit === 'ft') {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
  return `${Number(cm).toFixed(0)} cm`;
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString();
};
