'use client';

import React, { useState, useMemo, useCallback, useSyncExternalStore } from 'react';
import { parseISO, isValid } from 'date-fns';
import { Navbar } from '@/components/navbar/Navbar';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { LiveStatistics } from '@/components/statistics/LiveStatistics';
import { LifeGrid } from '@/components/life-grid/LifeGrid';
import { WeekDetailModal } from '@/components/life-grid/WeekDetailModal';
import { PerspectiveEngine } from '@/components/perspective/PerspectiveEngine';
import { MemoryArchive } from '@/components/memories/MemoryArchive';
import { MemoryModal } from '@/components/memories/MemoryModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import {
  CustomMilestone,
  ExportData,
  LifeMemory,
  LifeStats,
  UserSettings,
  WeekInfo,
} from '@/lib/types';
import {
  calculateLifeStats,
  getWeekInfo,
  WEEKS_PER_YEAR,
} from '@/lib/life-calculations';
import {
  clearAllData,
  DEFAULT_SETTINGS,
  DEFAULT_MILESTONES,
  loadMemories,
  loadMilestones,
  loadSettings,
  saveMemories,
  saveMilestones,
  saveSettings,
} from '@/lib/storage';

const subscribeEmpty = () => () => {};

export default function MementoMoriApp() {
  // Safe SSR hydration status via React's official useSyncExternalStore
  const isMounted = useSyncExternalStore(
    subscribeEmpty,
    () => true,
    () => false
  );

  // Initialize state directly from localStorage without cascading renders
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window !== 'undefined') return loadSettings();
    return DEFAULT_SETTINGS;
  });

  const [memories, setMemories] = useState<LifeMemory[]>(() => {
    if (typeof window !== 'undefined') return loadMemories();
    return [];
  });

  const [milestones, setMilestones] = useState<CustomMilestone[]>(() => {
    if (typeof window !== 'undefined') return loadMilestones();
    return DEFAULT_MILESTONES;
  });

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<WeekInfo | null>(null);
  const [showWeekDetailModal, setShowWeekDetailModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<LifeMemory | null>(null);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [memoryTargetWeek, setMemoryTargetWeek] = useState<WeekInfo | null>(null);

  // Sync settings changes to localStorage
  const handleUpdateSettings = useCallback((newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  // Onboarding completion handler
  const handleOnboardingComplete = useCallback(
    (dob: string, lifespanYears: number) => {
      setSettings((prev) => {
        const updated: UserSettings = {
          ...prev,
          dob,
          lifespanYears,
          isOnboarded: true,
        };
        saveSettings(updated);
        return updated;
      });
    },
    []
  );

  // Memory creation and update handler
  const handleSaveMemory = useCallback(
    (memoryData: { title: string; note: string; specificDate?: string }) => {
      if (!memoryTargetWeek) return;

      const nowIso = new Date().toISOString();

      if (editingMemory) {
        setMemories((prev) => {
          const updated = prev.map((m) =>
            m.id === editingMemory.id
              ? {
                  ...m,
                  title: memoryData.title,
                  note: memoryData.note,
                  specificDate: memoryData.specificDate,
                  updatedAt: nowIso,
                }
              : m
          );
          saveMemories(updated);
          return updated;
        });
      } else {
        const newMemory: LifeMemory = {
          id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          yearIndex: memoryTargetWeek.yearIndex,
          weekIndex: memoryTargetWeek.weekOfYear,
          totalWeekNumber: memoryTargetWeek.totalWeekIndex,
          title: memoryData.title,
          note: memoryData.note,
          specificDate: memoryData.specificDate,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        setMemories((prev) => {
          const updated = [...prev, newMemory];
          saveMemories(updated);
          return updated;
        });
      }

      setEditingMemory(null);
      setShowMemoryModal(false);
    },
    [memoryTargetWeek, editingMemory]
  );

  // Delete memory
  const handleDeleteMemory = useCallback(
    (memoryId: string) => {
      setMemories((prev) => {
        const updated = prev.filter((m) => m.id !== memoryId);
        saveMemories(updated);
        return updated;
      });
      if (editingMemory?.id === memoryId) {
        setEditingMemory(null);
      }
    },
    [editingMemory]
  );

  // Milestone handlers
  const handleAddMilestone = useCallback(
    (milestone: Omit<CustomMilestone, 'id'>) => {
      const newMilestone: CustomMilestone = {
        ...milestone,
        id: `ms-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };
      setMilestones((prev) => {
        const updated = [...prev, newMilestone];
        saveMilestones(updated);
        return updated;
      });
    },
    []
  );

  const handleDeleteMilestone = useCallback(
    (id: string) => {
      setMilestones((prev) => {
        const updated = prev.filter((m) => m.id !== id);
        saveMilestones(updated);
        return updated;
      });
    },
    []
  );

  // Data import & reset
  const handleImportData = useCallback((imported: ExportData) => {
    setSettings(imported.settings);
    saveSettings(imported.settings);

    setMemories(imported.memories);
    saveMemories(imported.memories);

    setMilestones(imported.milestones);
    saveMilestones(imported.milestones);
  }, []);

  const handleResetAllData = useCallback(() => {
    clearAllData();
    setSettings(DEFAULT_SETTINGS);
    setMemories([]);
    setMilestones(DEFAULT_MILESTONES);
    setSelectedWeek(null);
  }, []);

  // Parsed valid DOB
  const parsedDob = useMemo(() => {
    if (!settings.dob) return null;
    const parsed = parseISO(settings.dob);
    return isValid(parsed) ? parsed : null;
  }, [settings.dob]);

  // Calculated life stats
  const lifeStats: LifeStats | null = useMemo(() => {
    if (!parsedDob) return null;
    return calculateLifeStats(parsedDob, settings.lifespanYears, new Date());
  }, [parsedDob, settings.lifespanYears]);

  // Selected week memory lookup
  const selectedWeekMemory = useMemo(() => {
    if (!selectedWeek) return null;
    return (
      memories.find(
        (m) =>
          m.yearIndex === selectedWeek.yearIndex &&
          m.weekIndex === selectedWeek.weekOfYear
      ) || null
    );
  }, [selectedWeek, memories]);

  // Week selection handler
  const handleSelectWeek = useCallback((info: WeekInfo) => {
    setSelectedWeek(info);
    setShowWeekDetailModal(true);
  }, []);

  // Jump from memory archive to week in grid
  const handleSelectMemoryWeek = useCallback(
    (yearIndex: number, weekIndex: number) => {
      if (!parsedDob) return;
      const info = getWeekInfo(parsedDob, yearIndex, weekIndex, new Date(), true);
      setSelectedWeek(info);
      setShowWeekDetailModal(true);

      const rowEl = document.getElementById(`grid-year-row-${yearIndex}`);
      if (rowEl) {
        rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    [parsedDob]
  );

  // Week navigation inside WeekDetailModal
  const handleNavigateWeek = useCallback(
    (direction: -1 | 1) => {
      if (!selectedWeek || !parsedDob) return;
      let nextTotal = selectedWeek.totalWeekIndex + direction;
      const maxTotal = settings.lifespanYears * WEEKS_PER_YEAR - 1;
      if (nextTotal < 0) nextTotal = 0;
      if (nextTotal > maxTotal) nextTotal = maxTotal;

      const nextYear = Math.floor(nextTotal / WEEKS_PER_YEAR);
      const nextWeek = nextTotal % WEEKS_PER_YEAR;

      const hasMem = memories.some(
        (m) => m.yearIndex === nextYear && m.weekIndex === nextWeek
      );
      const nextInfo = getWeekInfo(parsedDob, nextYear, nextWeek, new Date(), hasMem);
      setSelectedWeek(nextInfo);
    },
    [selectedWeek, parsedDob, settings.lifespanYears, memories]
  );

  // Open add memory modal for a week
  const handleOpenAddMemory = useCallback((week: WeekInfo) => {
    setMemoryTargetWeek(week);
    setEditingMemory(null);
    setShowMemoryModal(true);
  }, []);

  // Open edit memory modal
  const handleOpenEditMemory = useCallback(
    (mem: LifeMemory) => {
      if (!parsedDob) return;
      const week = getWeekInfo(parsedDob, mem.yearIndex, mem.weekIndex, new Date(), true);
      setMemoryTargetWeek(week);
      setEditingMemory(mem);
      setShowMemoryModal(true);
    },
    [parsedDob]
  );

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#090909] text-[#F2F0EA] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[#D49B4B] border-t-transparent animate-spin" />
      </div>
    );
  }

  const showOnboarding = !settings.isOnboarded || !parsedDob;

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#090909] text-[#F2F0EA] overflow-x-hidden ${
        settings.reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        currentWeekNumber={lifeStats?.weeksLived}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Content Area: refined vertical rhythm to bring life grid in focus earlier on laptop screens */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-8 sm:space-y-10 overflow-x-hidden">
        {parsedDob && lifeStats ? (
          <>
            {/* Live Statistics Cards */}
            <LiveStatistics stats={lifeStats} dob={settings.dob} />

            {/* Life Grid */}
            <LifeGrid
              dob={parsedDob}
              lifespanYears={settings.lifespanYears}
              showChapterLabels={settings.showChapterLabels}
              memories={memories}
              onSelectWeek={handleSelectWeek}
              selectedWeek={selectedWeek}
            />

            {/* Perspective Engine */}
            <PerspectiveEngine
              dob={parsedDob}
              stats={lifeStats}
              milestones={milestones}
              onAddMilestone={handleAddMilestone}
              onDeleteMilestone={handleDeleteMilestone}
            />

            {/* Memory Archive */}
            <MemoryArchive
              memories={memories}
              onSelectMemoryWeek={handleSelectMemoryWeek}
              onEditMemory={handleOpenEditMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          </>
        ) : null}
      </main>

      {/* Editorial Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-10 text-center text-xs text-[#5C5A55] space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D49B4B]" />
          <span className="font-serif italic text-sm text-[#8B8984]">
            Memento Mori · Remember you must live
          </span>
        </div>
        <p>Private & client-side by design. Every week is your own.</p>
      </footer>

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        memories={memories}
        milestones={milestones}
        onSaveSettings={handleUpdateSettings}
        onImportData={handleImportData}
        onResetAllData={handleResetAllData}
      />

      {/* Week Detail Modal */}
      <WeekDetailModal
        isOpen={showWeekDetailModal}
        onClose={() => setShowWeekDetailModal(false)}
        weekInfo={selectedWeek}
        memory={selectedWeekMemory}
        onAddMemory={handleOpenAddMemory}
        onEditMemory={handleOpenEditMemory}
        onDeleteMemory={handleDeleteMemory}
        onNavigateWeek={handleNavigateWeek}
      />

      {/* Memory Create / Edit Modal */}
      <MemoryModal
        key={editingMemory?.id || (memoryTargetWeek ? `${memoryTargetWeek.yearIndex}-${memoryTargetWeek.weekOfYear}` : 'none')}
        isOpen={showMemoryModal}
        onClose={() => {
          setShowMemoryModal(false);
          setEditingMemory(null);
        }}
        weekInfo={memoryTargetWeek}
        existingMemory={editingMemory}
        onSave={handleSaveMemory}
      />
    </div>
  );
}
