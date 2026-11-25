/** "45 seconds", "1 minute", "12 minutes", "1 hour": a wait time in words, rounded up. */
export function formatWait(totalSeconds: number): string {
  const seconds = Math.max(1, Math.ceil(totalSeconds));
  if (seconds < 60) return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  const hours = Math.ceil(minutes / 60);
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}
