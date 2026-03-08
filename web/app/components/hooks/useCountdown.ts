import { useState, useEffect } from 'react';

const formatTimeLeft = (ms: number) => {
  if (ms <= 0) return 'Auction Ended';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  if (minutes > 0) return `${minutes}m ${seconds}s left`;
  return `${seconds}s left`;
};

export const useCountdown = (auctionEnd: string) => {
  const endTime = new Date(auctionEnd).getTime();
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(endTime - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const msLeft = endTime - Date.now();
      setTimeLeft(formatTimeLeft(msLeft));
      if (msLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};