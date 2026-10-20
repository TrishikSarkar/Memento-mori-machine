import { CustomMilestone, LifeMemory, UserSettings } from './types';
import { DEFAULT_LIFESPAN } from './life-calculations';

const SETTINGS_KEY = 'memento_mori_settings_v1';
const MEMORIES_KEY = 'memento_mori_memories_v1';
const MILESTONES_KEY = 'memento_mori_milestones_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  dob: '',
  lifespanYears: DEFAULT_LIFESPAN,
  showChapterLabels: true,
  reducedMotion: false,
  isOnboarded: false,
};

// Default starter milestone suggestions if user has none
export const DEFAULT_MILESTONES: CustomMilestone[] = [
  {
    id: 'next-decade',
    title: 'The Next Decade Mark',
    targetDate: '2030-01-01',
    description: 'A round milestone year on the calendar.',
    category: 'other',
  },
  {
    id: 'mid-century',
    title: 'Mid-Century (2050)',
    targetDate: '2050-01-01',
    description: 'The midpoint of the 21st century.',
    category: 'other',
  },
];

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (err) {
    console.error('Error loading settings from localStorage', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to localStorage', err);
  }
}

export function loadMemories(): LifeMemory[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading memories from localStorage', err);
    return [];
  }
}

export function saveMemories(memories: LifeMemory[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
  } catch (err) {
    console.error('Error saving memories to localStorage', err);
  }
}

export function loadMilestones(): CustomMilestone[] {
  if (typeof window === 'undefined') return DEFAULT_MILESTONES;
  try {
    const raw = localStorage.getItem(MILESTONES_KEY);
    if (!raw) return DEFAULT_MILESTONES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MILESTONES;
  } catch (err) {
    console.error('Error loading milestones from localStorage', err);
    return DEFAULT_MILESTONES;
  }
}

export function saveMilestones(milestones: CustomMilestone[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
  } catch (err) {
    console.error('Error saving milestones to localStorage', err);
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(MEMORIES_KEY);
    localStorage.removeItem(MILESTONES_KEY);
  } catch (err) {
    console.error('Error clearing data from localStorage', err);
  }
}
