import { format, isValid, parseISO, differenceInCalendarDays } from 'date-fns';

/**
 * Formats a date into an editorial readable string like "April 12, 1995"
 */
export function formatFullDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, 'MMMM d, yyyy');
}

/**
 * Formats a date into a compact string like "Apr 12, 1995"
 */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, 'MMM d, yyyy');
}

/**
 * Formats a week range like "Oct 14 – Oct 20, 2024"
 */
export function formatWeekRange(startDate: Date, endDate: Date): string {
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  if (sameYear) {
    return `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}`;
  }
  return `${format(startDate, 'MMM d, yyyy')} – ${format(endDate, 'MMM d, yyyy')}`;
}

/**
 * Calculates milestone difference in weeks and days
 */
export function calculateMilestoneDiff(targetDateString: string, referenceDate: Date = new Date()) {
  const target = parseISO(targetDateString);
  if (!isValid(target)) return null;

  const totalDays = differenceInCalendarDays(target, referenceDate);
  const isPast = totalDays < 0;
  const absDays = Math.abs(totalDays);
  const weeks = Math.floor(absDays / 7);
  const remainingDays = absDays % 7;

  return {
    isPast,
    totalDays: absDays,
    weeks,
    remainingDays,
    targetDate: target,
  };
}
