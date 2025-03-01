// Format date to local string
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

// Get time remaining in human readable format
export const getTimeRemaining = (closingTime: string): string => {
  const now = new Date();
  const end = new Date(closingTime);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Auction closed';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
};

// Get minimum date for auction closing (24 hours from now)
export const getMinClosingDate = (): string => {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  return now.toISOString().slice(0, 16);
};