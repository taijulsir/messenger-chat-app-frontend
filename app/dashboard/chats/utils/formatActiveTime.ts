export const formatLastActive = (lastActive: string | Date): string | null => {
  const now = new Date();
  
  // Ensure lastActive is a valid date
  const lastActiveDate = new Date(lastActive);
  const timeDiff = now.getTime() - lastActiveDate.getTime(); // Time difference in milliseconds
  
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // If the last active was more than 7 days ago, return null or don't show it
  if (days >= 7) {
    return null; // Don't show last active if more than 7 days ago
  }

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now'; // If the user was active within the last minute
  }
};
