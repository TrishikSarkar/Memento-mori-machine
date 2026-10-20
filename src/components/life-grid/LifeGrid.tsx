'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { ZoomIn, Sparkles } from 'lucide-react';
import { WeekCell } from './WeekCell';
import { GridLegend } from './GridLegend';
import { YearFocusView } from './YearFocusView';
import { Button } from '../ui/Button';
import { LifeMemory, WeekInfo } from '@/lib/types';
import { getWeekInfo, WEEKS_PER_YEAR, DEFAULT_CHAPTERS } from '@/lib/life-calculations';
import { formatWeekRange } from '@/lib/dates';

export interface LifeGridProps {
  dob: Date;
  lifespanYears: number;
  showChapterLabels: boolean;
  memories: LifeMemory[];
  onSelectWeek: (info: WeekInfo) => void;
  selectedWeek: WeekInfo | null;
}

export function LifeGrid({
  dob,
  lifespanYears,
  showChapterLabels,
  memories,
  onSelectWeek,
  selectedWeek,
}: LifeGridProps) {
  const [hoveredWeek, setHoveredWeek] = useState<WeekInfo | null>(null);
  const [focusYear, setFocusYear] = useState<number | null>(null);
  const [jumpYear, setJumpYear] = useState<number>(0);

  // Map of memories by "yearIndex-weekOfYear" for O(1) fast lookup
  const memoriesMap = useMemo(() => {
    const map = new Map<string, LifeMemory>();
    for (const mem of memories) {
      map.set(`${mem.yearIndex}-${mem.weekIndex}`, mem);
    }
    return map;
  }, [memories]);

  // Generate grid rows: an array of years [0..lifespanYears - 1]
  const years = useMemo(() => {
    return Array.from({ length: lifespanYears }, (_, i) => i);
  }, [lifespanYears]);

  // Current reference date (today)
  const today = useMemo(() => new Date(), []);

  // Compute weeks for a specific year
  const getWeeksForYear = useCallback(
    (yearIndex: number): WeekInfo[] => {
      const weeks: WeekInfo[] = [];
      for (let w = 0; w < WEEKS_PER_YEAR; w++) {
        const hasMem = memoriesMap.has(`${yearIndex}-${w}`);
        weeks.push(getWeekInfo(dob, yearIndex, w, today, hasMem));
      }
      return weeks;
    },
    [dob, today, memoriesMap]
  );

  // If currently in Year Focus mode
  if (focusYear !== null && focusYear >= 0 && focusYear < lifespanYears) {
    const yearWeeks = getWeeksForYear(focusYear);
    return (
      <YearFocusView
        yearIndex={focusYear}
        dob={dob}
        weeks={yearWeeks}
        memoriesMap={memoriesMap}
        onSelectWeek={onSelectWeek}
        onBackToOverview={() => setFocusYear(null)}
        onChangeYear={(y) => setFocusYear(y)}
        maxYear={lifespanYears}
      />
    );
  }

  return (
    <section id="life-grid-section" aria-label="Life in Weeks Grid" className="w-full space-y-4 sm:space-y-5">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-white/5">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#D49B4B] block mb-1">
            Your Life, in Weeks
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F2F0EA] font-normal tracking-tight">
            Every square is a week you will never get back.
          </h2>
        </div>

        {/* View Mode controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const currentAgeYear = Math.min(
                lifespanYears - 1,
                Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 3600 * 1000))
              );
              setFocusYear(Math.max(0, currentAgeYear));
            }}
            className="text-xs flex items-center gap-1.5"
            title="Zoom into a specific single year"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#D49B4B]" />
            <span>Year Focus</span>
          </Button>
        </div>
      </div>

      {/* Interactive Status & Jump Bar */}
      <div className="bg-[#121212] border border-white/10 rounded-xl p-3 sm:py-3 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Dynamic week inspect preview */}
        <div className="min-h-[20px] flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {hoveredWeek ? (
            <div className="flex items-center gap-2 text-[#F2F0EA] animate-in fade-in">
              <span className="font-mono text-[#D49B4B]">
                Age {hoveredWeek.yearIndex}, W{hoveredWeek.weekOfYear + 1}
              </span>
              <span className="text-[#8B8984]">·</span>
              <span className="text-[#8B8984]">{formatWeekRange(hoveredWeek.startDate, hoveredWeek.endDate)}</span>
              <span className="text-[#8B8984]">·</span>
              <span className="italic text-[#8B8984]">
                {hoveredWeek.isCurrent
                  ? 'Current week'
                  : hoveredWeek.isPast
                  ? 'Past week'
                  : 'Future estimate'}
              </span>
              {hoveredWeek.hasMemory && (
                <span className="text-[#D49B4B] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Memory attached
                </span>
              )}
            </div>
          ) : (
            <span className="text-[#5C5A55] italic">
              Hover over or tap any square to inspect dates, or click to anchor a memory.
            </span>
          )}
        </div>

        {/* Quick jump to year */}
        <div className="flex items-center gap-2 text-[#8B8984] shrink-0">
          <span>Jump to:</span>
          <select
            value={jumpYear}
            onChange={(e) => {
              const yr = Number(e.target.value);
              setJumpYear(yr);
              const rowEl = document.getElementById(`grid-year-row-${yr}`);
              if (rowEl) {
                rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="bg-[#181818] border border-white/10 text-[#F2F0EA] rounded px-2 py-0.5 text-xs focus:border-[#D49B4B] focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                Age {y} (Year {y + 1})
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFocusYear(jumpYear)}
            className="text-xs h-6 px-2 text-[#8B8984] hover:text-[#F2F0EA]"
          >
            Open Year
          </Button>
        </div>
      </div>

      {/* Legend */}
      <GridLegend />

      {/* Grid Canvas Wrapper: perfectly responsive desktop fitting with zero horizontal page scroll */}
      <div className="relative w-full bg-[#101010] border border-white/10 rounded-2xl p-3 sm:p-5 overflow-hidden">
        {/* Scrollable inner wrapper on very narrow mobile screens with explicit touch indicators */}
        <div className="w-full overflow-x-auto sm:overflow-x-visible">
          <div className="min-w-[540px] sm:min-w-0 w-full space-y-1">
            {/* Week column headers: exact 52-column grid mathematically aligned with cells below */}
            <div className="flex items-center gap-2 sm:gap-2.5 w-full mb-2 text-[9px] sm:text-[10px] font-mono text-[#5C5A55] select-none">
              {/* Spacer matching Age Label */}
              <div className="w-7 sm:w-8 md:w-9 shrink-0 text-right pr-1" aria-hidden="true">
                Age
              </div>

              {/* Exact 52-column grid matching the rows below */}
              <div className="flex-1 grid grid-cols-[repeat(52,minmax(0,1fr))] gap-[1.5px] sm:gap-[2px] md:gap-[2.5px]">
                <span className="col-start-1 col-span-3 text-left">W1</span>
                <span className="col-start-10 col-span-3 text-center">10</span>
                <span className="col-start-20 col-span-3 text-center">20</span>
                <span className="col-start-30 col-span-3 text-center">30</span>
                <span className="col-start-40 col-span-3 text-center">40</span>
                <span className="col-start-50 col-span-3 text-right">52</span>
              </div>
            </div>

            {/* Life Rows */}
            {years.map((yearIndex) => {
              const weeksInYear = getWeeksForYear(yearIndex);
              const chapter = showChapterLabels
                ? DEFAULT_CHAPTERS.find((ch) => ch.startAge === yearIndex)
                : undefined;

              return (
                <React.Fragment key={yearIndex}>
                  {/* Chapter separator banner if applicable */}
                  {chapter && (
                    <div className="pt-3 pb-1 flex items-center gap-3">
                      <span className="text-[11px] font-serif italic text-[#D49B4B] tracking-wide shrink-0">
                        {chapter.name} ({chapter.startAge}–{chapter.endAge} years)
                      </span>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>
                  )}

                  {/* Single Year Row (Age label + 52 weeks in a responsive CSS Grid) */}
                  <div
                    id={`grid-year-row-${yearIndex}`}
                    className="flex items-center gap-2 sm:gap-2.5 w-full py-[1.5px] group/row rounded hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Age Label */}
                    <button
                      type="button"
                      onClick={() => setFocusYear(yearIndex)}
                      className="w-7 sm:w-8 md:w-9 shrink-0 text-right text-[10px] sm:text-[11px] font-mono text-[#5C5A55] group-hover/row:text-[#D49B4B] transition-colors hover:underline cursor-pointer select-none"
                      title={`Zoom into Age ${yearIndex}`}
                    >
                      {yearIndex}y
                    </button>

                    {/* 52 Week cells responsive grid */}
                    <div className="flex-1 grid grid-cols-[repeat(52,minmax(0,1fr))] gap-[1.5px] sm:gap-[2px] md:gap-[2.5px] items-center">
                      {weeksInYear.map((week) => (
                        <WeekCell
                          key={week.weekOfYear}
                          info={week}
                          onSelect={onSelectWeek}
                          onHover={setHoveredWeek}
                          isSelected={
                            selectedWeek?.yearIndex === week.yearIndex &&
                            selectedWeek?.weekOfYear === week.weekOfYear
                          }
                        />
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
