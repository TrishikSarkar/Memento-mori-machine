'use client';

import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LifeMemory, WeekInfo } from '@/lib/types';
import { formatShortDate } from '@/lib/dates';
import { getChapterForAge } from '@/lib/life-calculations';

export interface YearFocusViewProps {
  yearIndex: number;
  dob?: Date;
  weeks: WeekInfo[];
  memoriesMap: Map<string, LifeMemory>;
  onSelectWeek: (info: WeekInfo) => void;
  onBackToOverview: () => void;
  onChangeYear: (newYear: number) => void;
  maxYear: number;
}

export function YearFocusView({
  yearIndex,
  weeks,
  memoriesMap,
  onSelectWeek,
  onBackToOverview,
  onChangeYear,
  maxYear,
}: YearFocusViewProps) {
  const chapter = getChapterForAge(yearIndex);
  const startOfYear = weeks[0]?.startDate;
  const endOfYear = weeks[weeks.length - 1]?.endDate;

  const memoriesInThisYear = weeks.filter((w) => w.hasMemory);

  return (
    <div className="w-full bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBackToOverview}
            className="flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview Matrix</span>
          </Button>

          {chapter && <Badge variant="chapter">{chapter.name}</Badge>}
        </div>

        {/* Year Picker / Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="year-focus-select" className="text-xs text-[#8B8984]">
            Viewing Age:
          </label>
          <select
            id="year-focus-select"
            value={yearIndex}
            onChange={(e) => onChangeYear(Number(e.target.value))}
            className="bg-[#181818] border border-white/10 text-[#F2F0EA] text-xs rounded-lg px-2.5 py-1 focus:border-[#D49B4B] focus:outline-none"
          >
            {Array.from({ length: maxYear }, (_, i) => (
              <option key={i} value={i}>
                Age {i} (Year {i + 1})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Year Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D49B4B]">
            Deep Year View
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[#F2F0EA] font-medium mt-0.5">
            Age {yearIndex} · The 52 Weeks of this Year
          </h2>
          {startOfYear && endOfYear && (
            <p className="text-xs text-[#8B8984] mt-0.5">
              Spans from {formatShortDate(startOfYear)} to {formatShortDate(endOfYear)}
            </p>
          )}
        </div>

        <div className="text-xs text-[#8B8984] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D49B4B]" />
          <span>
            {memoriesInThisYear.length > 0
              ? `${memoriesInThisYear.length} memory anchored in this year`
              : 'No memories saved yet for this year'}
          </span>
        </div>
      </div>

      {/* Detailed 52 Weeks Grid in Year Focus: 4 quarters of 13 weeks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5 sm:gap-2 pt-2">
        {weeks.map((week) => {
          const mem = memoriesMap.get(`${week.yearIndex}-${week.weekOfYear}`);

          return (
            <div
              key={week.weekOfYear}
              onClick={() => onSelectWeek(week)}
              className="group relative p-2 rounded-lg bg-[#181818] border border-white/5 hover:border-[#D49B4B]/50 hover:bg-[#202020] transition-all cursor-pointer flex flex-col justify-between min-h-[68px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#8B8984]">
                  W{week.weekOfYear + 1}
                </span>
                {week.isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-[#D49B4B] current-week-pulse" />
                )}
                {week.hasMemory && !week.isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-[#D49B4B]" />
                )}
              </div>

              <div className="mt-1">
                <span className="text-[9px] text-[#5C5A55] block line-clamp-1">
                  {formatShortDate(week.startDate)}
                </span>
                {mem && (
                  <span className="text-[10px] text-[#F2F0EA] font-serif block truncate mt-0.5">
                    {mem.title}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
