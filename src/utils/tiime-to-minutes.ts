export function toMinutes(hhmm: string): number {
  if (typeof hhmm !== 'string') {
    throw new Error(`toMinutes: expected string, got ${typeof hhmm}`);
  }

  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!match) {
    throw new Error(`toMinutes: invalid format "${hhmm}", expected HH:MM`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    throw new Error(`toMinutes: non-integer values in "${hhmm}"`);
  }
  if (hours < 0 || hours > 23) {
    throw new Error(`toMinutes: hours out of range 0–23 in "${hhmm}"`);
  }
  if (minutes < 0 || minutes > 59) {
    throw new Error(`toMinutes: minutes out of range 0–59 in "${hhmm}"`);
  }

  return hours * 60 + minutes;
}
