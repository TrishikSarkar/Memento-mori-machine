import { ExportData, LifeMemory, CustomMilestone, UserSettings } from './types';
import { validateDateOfBirth } from './life-calculations';

const CURRENT_EXPORT_VERSION = 1;

export function createExportPayload(
  settings: UserSettings,
  memories: LifeMemory[],
  milestones: CustomMilestone[]
): ExportData {
  return {
    version: CURRENT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    memories,
    milestones,
  };
}

export function downloadExportJson(data: ExportData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `memento-mori-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: ExportData;
}

export function validateImportJson(rawJson: string): ValidationResult {
  if (!rawJson || typeof rawJson !== 'string') {
    return { isValid: false, error: 'Empty or invalid file content.' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { isValid: false, error: 'File is not valid JSON.' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { isValid: false, error: 'JSON content must be an object.' };
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.version !== 'number' || obj.version < 1) {
    return { isValid: false, error: 'Invalid or missing data format version.' };
  }

  // Validate settings
  if (!obj.settings || typeof obj.settings !== 'object') {
    return { isValid: false, error: 'Invalid or missing "settings" section.' };
  }

  const s = obj.settings as Record<string, unknown>;
  if (typeof s.dob !== 'string') {
    return { isValid: false, error: 'Settings missing valid date of birth.' };
  }

  if (s.dob.trim() !== '') {
    const dobCheck = validateDateOfBirth(s.dob);
    if (!dobCheck.isValid) {
      return { isValid: false, error: `Invalid date of birth in settings: ${dobCheck.error}` };
    }
  }

  const lifespanYears = typeof s.lifespanYears === 'number' && s.lifespanYears >= 30 && s.lifespanYears <= 130
    ? s.lifespanYears
    : 80;

  const validatedSettings: UserSettings = {
    dob: s.dob,
    lifespanYears,
    showChapterLabels: typeof s.showChapterLabels === 'boolean' ? s.showChapterLabels : true,
    reducedMotion: typeof s.reducedMotion === 'boolean' ? s.reducedMotion : false,
    isOnboarded: typeof s.isOnboarded === 'boolean' ? s.isOnboarded : Boolean(s.dob),
  };

  // Validate memories
  const validatedMemories: LifeMemory[] = [];
  if (Array.isArray(obj.memories)) {
    for (const mem of obj.memories) {
      if (!mem || typeof mem !== 'object') continue;
      const m = mem as Record<string, unknown>;

      const title = typeof m.title === 'string' ? m.title.trim().slice(0, 200) : '';
      const note = typeof m.note === 'string' ? m.note.trim().slice(0, 5000) : '';
      const yearIndex = typeof m.yearIndex === 'number' ? Math.floor(m.yearIndex) : 0;
      const weekIndex = typeof m.weekIndex === 'number' ? Math.floor(m.weekIndex) : 0;
      const totalWeekNumber = typeof m.totalWeekNumber === 'number'
        ? Math.floor(m.totalWeekNumber)
        : yearIndex * 52 + weekIndex;

      if (!title && !note) continue;

      validatedMemories.push({
        id: typeof m.id === 'string' ? m.id : `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        yearIndex,
        weekIndex,
        totalWeekNumber,
        title,
        note,
        specificDate: typeof m.specificDate === 'string' ? m.specificDate : undefined,
        createdAt: typeof m.createdAt === 'string' ? m.createdAt : new Date().toISOString(),
        updatedAt: typeof m.updatedAt === 'string' ? m.updatedAt : new Date().toISOString(),
      });
    }
  }

  // Validate milestones
  const validatedMilestones: CustomMilestone[] = [];
  if (Array.isArray(obj.milestones)) {
    for (const ms of obj.milestones) {
      if (!ms || typeof ms !== 'object') continue;
      const m = ms as Record<string, unknown>;
      if (typeof m.title !== 'string' || typeof m.targetDate !== 'string') continue;

      validatedMilestones.push({
        id: typeof m.id === 'string' ? m.id : `ms-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: m.title.trim().slice(0, 150),
        targetDate: m.targetDate,
        description: typeof m.description === 'string' ? m.description.slice(0, 1000) : undefined,
        category: typeof m.category === 'string' ? (m.category as CustomMilestone['category']) : 'other',
      });
    }
  }

  const exportData: ExportData = {
    version: obj.version,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
    settings: validatedSettings,
    memories: validatedMemories,
    milestones: validatedMilestones,
  };

  return {
    isValid: true,
    data: exportData,
  };
}
