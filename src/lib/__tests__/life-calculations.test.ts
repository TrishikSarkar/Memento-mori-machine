import { describe, it, expect } from 'vitest';
import {
  validateDateOfBirth,
  getWeekDateRange,
  getWeekInfo,
  calculateLifeStats,
  getNextBirthday,
  getChapterForAge,
  calculatePerspectiveMetrics,
  WEEKS_PER_YEAR,
} from '../life-calculations';
import { validateImportJson } from '../export-import';
import { parseISO } from 'date-fns';

describe('Life Calculations', () => {
  it('validates date of birth correctly', () => {
    const fixedNow = new Date('2024-06-15T12:00:00Z');

    // Future date should be invalid
    const futureRes = validateDateOfBirth('2025-01-01', fixedNow);
    expect(futureRes.isValid).toBe(false);
    expect(futureRes.error).toContain('cannot be in the future');

    // Impossibly old (>120 yrs) should be invalid
    const oldRes = validateDateOfBirth('1890-01-01', fixedNow);
    expect(oldRes.isValid).toBe(false);
    expect(oldRes.error).toContain('within the last 120 years');

    // Empty string
    const emptyRes = validateDateOfBirth('', fixedNow);
    expect(emptyRes.isValid).toBe(false);

    // Valid DOB
    const validRes = validateDateOfBirth('1995-04-12', fixedNow);
    expect(validRes.isValid).toBe(true);
    expect(validRes.parsedDate).toBeDefined();
  });

  it('calculates week date ranges with exact boundaries and handles leap years', () => {
    // Born on a leap year
    const dob = parseISO('2000-01-01');

    // Week 0: Jan 1, 2000 to Jan 7, 2000
    const week0 = getWeekDateRange(dob, 0, 0);
    expect(week0.startDate.getDate()).toBe(1);
    expect(week0.startDate.getMonth()).toBe(0); // Jan

    // Week 51 (last week of year 0) should end right before 1st birthday (Dec 31, 2000)
    const week51 = getWeekDateRange(dob, 0, 51);
    expect(week51.endDate.getFullYear()).toBe(2000);
    expect(week51.endDate.getMonth()).toBe(11); // Dec
    expect(week51.endDate.getDate()).toBe(31);

    // Year 1 starts on Jan 1, 2001
    const week0Year1 = getWeekDateRange(dob, 1, 0);
    expect(week0Year1.startDate.getFullYear()).toBe(2001);
    expect(week0Year1.startDate.getMonth()).toBe(0);
    expect(week0Year1.startDate.getDate()).toBe(1);
  });

  it('accurately identifies past, current, and future weeks', () => {
    const dob = parseISO('2000-01-01');
    const referenceDate = new Date('2024-06-15T12:00:00Z'); // Age 24

    // Week in Year 10 (Age 10) should be past
    const pastWeek = getWeekInfo(dob, 10, 20, referenceDate);
    expect(pastWeek.isPast).toBe(true);
    expect(pastWeek.isCurrent).toBe(false);
    expect(pastWeek.isFuture).toBe(false);

    // Week in Year 40 (Age 40) should be future
    const futureWeek = getWeekInfo(dob, 40, 5, referenceDate);
    expect(futureWeek.isFuture).toBe(true);
    expect(futureWeek.isPast).toBe(false);
    expect(futureWeek.isCurrent).toBe(false);

    // Current week: Age 24, around week 23 in 2024
    let currentWeekFound = false;
    for (let w = 0; w < WEEKS_PER_YEAR; w++) {
      const info = getWeekInfo(dob, 24, w, referenceDate);
      if (info.isCurrent) {
        currentWeekFound = true;
        expect(info.isPast).toBe(false);
        expect(info.isFuture).toBe(false);
        break;
      }
    }
    expect(currentWeekFound).toBe(true);
  });

  it('calculates life stats and next birthday correctly', () => {
    const dob = parseISO('2000-06-15');
    const referenceDate = new Date('2024-06-10T12:00:00Z'); // 5 days before 24th birthday

    const stats = calculateLifeStats(dob, 80, referenceDate);
    expect(stats.weeksLived).toBeGreaterThan(0);
    expect(stats.daysLived).toBeGreaterThan(0);
    expect(stats.totalLifespanWeeks).toBe(80 * 52);
    expect(stats.nextBirthday.turningAge).toBe(24);
    expect(stats.nextBirthday.daysRemaining).toBe(4);
  });

  it('handles birthday day itself and leap-day birthday correctly', () => {
    // Exactly on birthday at 14:00
    const dob = parseISO('1998-05-15');
    const onBirthday = new Date('2024-05-15T14:00:00');
    const bdayInfo = getNextBirthday(dob, onBirthday);
    expect(bdayInfo.turningAge).toBe(26);
    expect(bdayInfo.daysRemaining).toBe(0);

    // Day after birthday
    const dayAfter = new Date('2024-05-16T08:00:00');
    const nextYearInfo = getNextBirthday(dob, dayAfter);
    expect(nextYearInfo.turningAge).toBe(27);

    // Leap day birthdate (Feb 29, 2000)
    const leapDob = parseISO('2000-02-29');
    const nonLeapRef = new Date('2023-01-01T00:00:00');
    const leapBdayInfo = getNextBirthday(leapDob, nonLeapRef);
    expect(leapBdayInfo.turningAge).toBe(23);
    expect(leapBdayInfo.date).toBeDefined();
  });

  it('maps life chapters appropriately', () => {
    expect(getChapterForAge(5)?.id).toBe('childhood');
    expect(getChapterForAge(16)?.id).toBe('adolescence');
    expect(getChapterForAge(28)?.id).toBe('early-adulthood');
    expect(getChapterForAge(45)?.id).toBe('midlife');
    expect(getChapterForAge(72)?.id).toBe('later-life');
  });

  it('computes perspective metrics realistically', () => {
    const dob = parseISO('1990-01-01');
    const refDate = new Date('2020-01-01'); // 30 years lived
    const metrics = calculatePerspectiveMetrics(dob, refDate);

    expect(metrics.weeksLived).toBeGreaterThan(1500);
    expect(metrics.fullMoons).toBeGreaterThan(350);
    expect(metrics.seasonsExperienced).toBeGreaterThan(115);
    expect(metrics.wakingWeeks).toBe(Math.round(metrics.weeksLived * (2 / 3)));
  });
});

describe('Export and Import Validation', () => {
  it('validates clean export JSON', () => {
    const validJson = JSON.stringify({
      version: 1,
      exportedAt: '2024-01-01T00:00:00.000Z',
      settings: {
        dob: '1995-05-20',
        lifespanYears: 85,
        showChapterLabels: true,
        reducedMotion: false,
        isOnboarded: true,
      },
      memories: [
        {
          id: 'mem-1',
          yearIndex: 25,
          weekIndex: 12,
          totalWeekNumber: 25 * 52 + 12,
          title: 'Started new craft',
          note: 'A week that altered perspective.',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ],
      milestones: [],
    });

    const res = validateImportJson(validJson);
    expect(res.isValid).toBe(true);
    expect(res.data?.settings.dob).toBe('1995-05-20');
    expect(res.data?.memories.length).toBe(1);
    expect(res.data?.memories[0].title).toBe('Started new craft');
  });

  it('rejects invalid or corrupted JSON safely', () => {
    expect(validateImportJson('bad json').isValid).toBe(false);
    expect(validateImportJson(JSON.stringify({ version: 0 })).isValid).toBe(false);
    expect(validateImportJson(JSON.stringify({ version: 1, settings: { dob: 'invalid-date' } })).isValid).toBe(false);
  });
});
