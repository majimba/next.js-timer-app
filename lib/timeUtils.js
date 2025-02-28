/**
 * Format milliseconds into a readable time string (HH:MM:SS.ms)
 * @param {number} time - Time in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(time) {
  if (time === undefined || time === null) return '00:00:00.00';
  
  // Handle negative time (shouldn't happen, but just in case)
  const absTime = Math.abs(time);
  
  // Calculate hours, minutes, seconds, and milliseconds
  const hours = Math.floor(absTime / 3600000);
  const minutes = Math.floor((absTime % 3600000) / 60000);
  const seconds = Math.floor((absTime % 60000) / 1000);
  const milliseconds = Math.floor((absTime % 1000) / 10);
  
  // Format with leading zeros
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMilliseconds = milliseconds.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

/**
 * Format milliseconds into a simplified time string (MM:SS.ms)
 * @param {number} time - Time in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTimeShort(time) {
  if (time === undefined || time === null) return '00:00.00';
  
  // Handle negative time (shouldn't happen, but just in case)
  const absTime = Math.abs(time);
  
  // Calculate minutes, seconds, and milliseconds
  const minutes = Math.floor(absTime / 60000);
  const seconds = Math.floor((absTime % 60000) / 1000);
  const milliseconds = Math.floor((absTime % 1000) / 10);
  
  // Format with leading zeros
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMilliseconds = milliseconds.toString().padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}
