export function toTime(totalMinutes: number): string {
  if (!Number.isInteger(totalMinutes)) {
    throw new Error(`minutesToHHMM: expected integer, got ${totalMinutes}`);
  }
  if (totalMinutes < 0 || totalMinutes >= 24 * 60) {
    throw new Error(`minutesToHHMM: minutes must be between 0 and 1439, got ${totalMinutes}`);
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
