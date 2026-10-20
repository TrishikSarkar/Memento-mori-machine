import {
  addDays,
  addYears,
  differenceInCalendarDays,
  differenceInSeconds,
  isAfter,
  isBefore,
  isValid,
  parseISO,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { LifeChapter, LifeStats, WeekInfo } from './types';

export const DEFAULT_LIFESPAN = 80;
export const MIN_LIFESPAN = 50;
export const MAX_LIFESPAN = 110;
export const WEEKS_PER_YEAR = 52;

export const DEFAULT_CHAPTERS: LifeChapter[] = [
  {
    id: 'childhood',
    name: 'Childhood',
    startAge: 0,
    endAge: 12,
    description: 'The foundation of wonder, first memories, and early discovery.',
    accentColor: '#9CA3AF',
  },
  {
    id: 'adolescence',
    name: 'Adolescence',
    startAge: 13,
    endAge: 19,
    description: 'Identity formation, questioning, friendships, and change.',
    accentColor: '#A78BFA',
  },
  {
    id: 'early-adulthood',
    name: 'Early Adulthood',
    startAge: 20,
    endAge: 35,
    description: 'Independence, craft, exploration, and building paths.',
    accentColor: '#F59E0B',
  },
  {
    id: 'midlife',
    name: 'Midlife',
    startAge: 36,
    endAge: 59,
    description: 'Depth of perspective, mastery, stewardship, and re-evaluation.',
    accentColor: '#10B981',
  },
  {
    id: 'later-life',
    name: 'Later Life',
    startAge: 60,
    endAge: 120,
    description: 'Wisdom, synthesis, reflection, and quiet legacy.',
    accentColor: '#60A5FA',
  },
];

/**
 * Validates a Date of Birth string.
 * Must be a valid date, not in the future, and not older than 120 years.
 */
export function validateDateOfBirth(dobString: string, referenceDate: Date = new Date()): {
  isValid: boolean;
  error?: string;
  parsedDate?: Date;
} {
  if (!dobString || dobString.trim() === '') {
    return { isValid: false, error: 'Please enter your date of birth.' };
  }

  const parsed = parseISO(dobString);
  if (!isValid(parsed)) {
    return { isValid: false, error: 'Please enter a valid calendar date.' };
  }

  const today = startOfDay(referenceDate);
  const birthDay = startOfDay(parsed);

  if (isAfter(birthDay, today)) {
    return { isValid: false, error: 'Date of birth cannot be in the future.' };
  }

  const maxAgeDate = addYears(today, -120);
  if (isBefore(birthDay, maxAgeDate)) {
    return { isValid: false, error: 'Date of birth must be within the last 120 years.' };
  }

  return { isValid: true, parsedDate: birthDay };
}

/**
 * Gets the Chapter for a given age in years.
 */
export function getChapterForAge(age: number, chapters: LifeChapter[] = DEFAULT_CHAPTERS): LifeChapter | undefined {
  return chapters.find((ch) => age >= ch.startAge && age <= ch.endAge);
}

/**
 * Calculates start and end dates for a specific week in a person's life.
 * Year `yearIndex` starts on user's `yearIndex`-th birthday.
 * Week `weekIndex` (0..51) spans 7 days, with week 51 covering the remainder until the next birthday.
 * Normalizes all timestamps with startOfDay and endOfDay to avoid daylight savings/timezone offset drift.
 */
export function getWeekDateRange(
  dob: Date,
  yearIndex: number,
  weekIndex: number
): { startDate: Date; endDate: Date } {
  const cleanDob = startOfDay(dob);
  const yearStart = addYears(cleanDob, yearIndex);
  const nextYearStart = addYears(cleanDob, yearIndex + 1);

  const startDate = startOfDay(addDays(yearStart, weekIndex * 7));

  let endDate: Date;
  if (weekIndex === WEEKS_PER_YEAR - 1) {
    // Last week of this life year: ends on the day before the next birthday
    endDate = endOfDay(addDays(nextYearStart, -1));
  } else {
    endDate = endOfDay(addDays(startDate, 6));
  }

  return { startDate, endDate };
}

/**
 * Computes week info for a specific year and week index.
 */
export function getWeekInfo(
  dob: Date,
  yearIndex: number,
  weekIndex: number,
  referenceDate: Date = new Date(),
  hasMemory: boolean = false
): WeekInfo {
  const { startDate, endDate } = getWeekDateRange(dob, yearIndex, weekIndex);
  const totalWeekIndex = yearIndex * WEEKS_PER_YEAR + weekIndex;

  const today = referenceDate;
  const isPast = isAfter(today, endDate);
  const isFuture = isBefore(today, startDate);
  const isCurrent = !isPast && !isFuture;

  return {
    yearIndex,
    weekOfYear: weekIndex,
    totalWeekIndex,
    startDate,
    endDate,
    isPast,
    isCurrent,
    isFuture,
    hasMemory,
    chapter: getChapterForAge(yearIndex),
  };
}

/**
 * Calculates next birthday details and remaining time.
 * Correctly accounts for when today is the birthday itself, leap-day birthdays, and end-of-day boundaries.
 */
export function getNextBirthday(
  dob: Date,
  referenceDate: Date = new Date()
): LifeStats['nextBirthday'] {
  const now = referenceDate;
  const birthDayStart = startOfDay(dob);

  let turningAge = 1;
  let nextBday = addYears(birthDayStart, turningAge);

  // If the end of this birthday has already passed, advance to next year
  while (isBefore(endOfDay(nextBday), now)) {
    turningAge += 1;
    nextBday = addYears(birthDayStart, turningAge);
  }

  const targetDate = startOfDay(nextBday);
  const totalSeconds = Math.max(0, differenceInSeconds(targetDate, now));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    date: targetDate,
    daysRemaining: days,
    hoursRemaining: hours,
    minutesRemaining: minutes,
    secondsRemaining: seconds,
    turningAge,
  };
}

/**
 * Calculates high-level life statistics.
 */
export function calculateLifeStats(
  dob: Date,
  lifespanYears: number = DEFAULT_LIFESPAN,
  referenceDate: Date = new Date()
): LifeStats {
  const now = referenceDate;
  const cleanDob = startOfDay(dob);
  const daysLived = Math.max(0, differenceInCalendarDays(now, cleanDob));
  const weeksLived = Math.floor(daysLived / 7);

  const exactAge = daysLived / 365.2425;
  const fullYears = Math.floor(exactAge);
  const daysPastLastBirthday = Math.max(0, differenceInCalendarDays(now, addYears(cleanDob, fullYears)));

  const formattedAge = `${fullYears} yrs, ${daysPastLastBirthday} days`;

  const totalLifespanWeeks = lifespanYears * WEEKS_PER_YEAR;
  const weeksRemainingEstimate = Math.max(0, totalLifespanWeeks - weeksLived);
  const percentageLived = Math.min(100, (weeksLived / totalLifespanWeeks) * 100);

  const nextBirthday = getNextBirthday(cleanDob, now);

  return {
    weeksLived,
    daysLived,
    currentAgeYears: Number(exactAge.toFixed(2)),
    currentAgeFormatted: formattedAge,
    totalLifespanWeeks,
    weeksRemainingEstimate,
    percentageLived: Number(percentageLived.toFixed(1)),
    nextBirthday,
  };
}

/**
 * Calculates comparative perspective metrics.
 */
export function calculatePerspectiveMetrics(dob: Date, referenceDate: Date = new Date()) {
  const cleanDob = startOfDay(dob);
  const daysLived = Math.max(0, differenceInCalendarDays(referenceDate, cleanDob));
  const weeksLived = Math.floor(daysLived / 7);

  const wakingWeeks = Math.round(weeksLived * (2 / 3));
  const sleepWeeks = Math.round(weeksLived * (1 / 3));
  const fullMoons = Math.floor(daysLived / 29.53059);
  const seasonsExperienced = Math.floor(daysLived / 91.31);
  const approximateHeartbeatsMillions = Number(((daysLived * 115200) / 1000000).toFixed(1));
  const approximateBreathsMillions = Number(((daysLived * 23040) / 1000000).toFixed(1));

  return {
    weeksLived,
    wakingWeeks,
    sleepWeeks,
    fullMoons,
    seasonsExperienced,
    approximateHeartbeatsMillions,
    approximateBreathsMillions,
  };
}
