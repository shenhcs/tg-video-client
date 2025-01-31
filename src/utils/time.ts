export const formatTime = (seconds: number): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const padMs = (num: number) => num.toString().padStart(3, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${padMs(ms)}`;
};

export const timeToSeconds = (timeStr: string): number => {
  const [timeComponent, msComponent] = timeStr.split('.');
  const [hours, minutes, seconds] = timeComponent.split(':').map(Number);
  const ms = msComponent ? Number(msComponent) / 1000 : 0;
  return hours * 3600 + minutes * 60 + seconds + ms;
};

export const validateTimeFormat = (timeStr: string): boolean => {
  const timeRegex = /^([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{3})?$/;
  if (!timeRegex.test(timeStr)) return false;
  
  const [timeComponent] = timeStr.split('.');
  const [hours, minutes, seconds] = timeComponent.split(':').map(Number);
  
  return (
    hours >= 0 && hours < 100 &&
    minutes >= 0 && minutes < 60 &&
    seconds >= 0 && seconds < 60
  );
}; 