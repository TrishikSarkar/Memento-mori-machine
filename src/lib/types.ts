export interface UserSettings {
  dob: string; // ISO format 'YYYY-MM-DD'
  lifespanYears: number; // e.g. 80
  showChapterLabels: boolean;
  reducedMotion: boolean;
  isOnboarded: boolean;
}

export interface LifeMemory {
  id: string;
  yearIndex: number; // 0 to lifespanYears - 1
  weekIndex: number; // 0 to 51
  totalWeekNumber: number; // absolute week index from birth (0 to totalWeeks - 1)
  title: string;
  note: string;
  specificDate?: string; // ISO date 'YYYY-MM-DD'
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface CustomMilestone {
  id: string;
  title: string;
  targetDate: string; // ISO 'YYYY-MM-DD'
  description?: string;
  category?: 'personal' | 'career' | 'health' | 'creative' | 'other';
}

export interface WeekInfo {
  yearIndex: number; // 0 to lifespan - 1 (Age in years)
  weekOfYear: number; // 0 to 51
  totalWeekIndex: number; // 0 to totalWeeks - 1
  startDate: Date;
  endDate: Date;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  hasMemory: boolean;
  chapter?: LifeChapter;
}

export interface LifeChapter {
  id: string;
  name: string;
  startAge: number; // inclusive
  endAge: number; // inclusive
  description: string;
  accentColor?: string;
}

export interface LifeStats {
  weeksLived: number;
  daysLived: number;
  currentAgeYears: number;
  currentAgeFormatted: string;
  totalLifespanWeeks: number;
  weeksRemainingEstimate: number;
  percentageLived: number;
  nextBirthday: {
    date: Date;
    daysRemaining: number;
    hoursRemaining: number;
    minutesRemaining: number;
    secondsRemaining: number;
    turningAge: number;
  };
}

export interface ExportData {
  version: number;
  exportedAt: string;
  settings: UserSettings;
  memories: LifeMemory[];
  milestones: CustomMilestone[];
}
