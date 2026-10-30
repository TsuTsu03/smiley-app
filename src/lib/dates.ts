const DAY_MS = 86_400_000;

export function daysUntil(date: string | Date, now: number = Date.now()): number {
  return Math.ceil((new Date(date).getTime() - now) / DAY_MS);
}
