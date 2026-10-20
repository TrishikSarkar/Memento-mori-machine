'use client';

import React from 'react';
import { Moon, Sun, Sunrise, Heart } from 'lucide-react';
import { MilestoneCalculator } from './MilestoneCalculator';
import { CustomMilestone, LifeStats } from '@/lib/types';
import { calculatePerspectiveMetrics } from '@/lib/life-calculations';

export interface PerspectiveEngineProps {
  dob: Date;
  stats: LifeStats;
  milestones: CustomMilestone[];
  onAddMilestone: (milestone: Omit<CustomMilestone, 'id'>) => void;
  onDeleteMilestone: (id: string) => void;
}

export function PerspectiveEngine({
  dob,
  stats,
  milestones,
  onAddMilestone,
  onDeleteMilestone,
}: PerspectiveEngineProps) {
  const metrics = calculatePerspectiveMetrics(dob);

  return (
    <section id="perspective-section" aria-label="Perspective Engine" className="w-full space-y-6">
      {/* Editorial Header */}
      <div className="pb-2 border-b border-white/5">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D49B4B] block mb-1">
          A Different Perspective
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#F2F0EA] font-normal tracking-tight">
          Translating abstract time into tangible existence.
        </h2>
      </div>

      {/* Tangible Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Seasons */}
        <div className="p-5 rounded-xl bg-[#121212] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8B8984]">
            <span className="uppercase tracking-wider">Seasons Lived</span>
            <Sun className="w-4 h-4 text-amber-300/80" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-serif text-[#F2F0EA]">
              {metrics.seasonsExperienced.toLocaleString()}
            </div>
            <div className="text-xs text-[#8B8984] mt-1">
              Springs, summers, autumns, and winters passed through
            </div>
          </div>
        </div>

        {/* Lunar Cycles */}
        <div className="p-5 rounded-xl bg-[#121212] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8B8984]">
            <span className="uppercase tracking-wider">Full Moons</span>
            <Moon className="w-4 h-4 text-slate-300" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-serif text-[#F2F0EA]">
              {metrics.fullMoons.toLocaleString()}
            </div>
            <div className="text-xs text-[#8B8984] mt-1">
              Complete lunar orbits witnessed since your birth
            </div>
          </div>
        </div>

        {/* Waking vs Asleep Weeks */}
        <div className="p-5 rounded-xl bg-[#121212] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8B8984]">
            <span className="uppercase tracking-wider">Conscious Weeks</span>
            <Sunrise className="w-4 h-4 text-[#D49B4B]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-serif text-[#F2F0EA]">
              ~{metrics.wakingWeeks.toLocaleString()}
            </div>
            <div className="text-xs text-[#8B8984] mt-1">
              Waking weeks lived (~{metrics.sleepWeeks.toLocaleString()} spent in restful sleep)
            </div>
          </div>
        </div>

        {/* Heartbeats */}
        <div className="p-5 rounded-xl bg-[#121212] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8B8984]">
            <span className="uppercase tracking-wider">Heartbeats</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-serif text-[#F2F0EA]">
              ~{metrics.approximateHeartbeatsMillions}M
            </div>
            <div className="text-xs text-[#8B8984] mt-1">
              Quiet beats keeping the rhythm of your life
            </div>
          </div>
        </div>
      </div>

      {/* The 52 Sundays Reflection Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141414] to-[#111111] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <h4 className="font-serif text-lg text-[#F2F0EA] font-medium">
            The 52 Sundays of each year
          </h4>
          <p className="text-xs sm:text-sm text-[#8B8984] leading-relaxed">
            In any given year, there are only 52 weekends, 52 Monday mornings, and 52 quiet Sunday afternoons. When seen together on a grid, an entire year fits on a single line of your notebook.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-2xl font-serif text-[#D49B4B]">52</div>
            <div className="text-[10px] text-[#5C5A55] uppercase tracking-wider">Weeks per Year</div>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="text-right">
            <div className="text-2xl font-serif text-[#F2F0EA]">{stats.totalLifespanWeeks.toLocaleString()}</div>
            <div className="text-[10px] text-[#5C5A55] uppercase tracking-wider">Total in {stats.totalLifespanWeeks / 52} Years</div>
          </div>
        </div>
      </div>

      {/* Milestone Calculator */}
      <MilestoneCalculator
        milestones={milestones}
        onAddMilestone={onAddMilestone}
        onDeleteMilestone={onDeleteMilestone}
      />
    </section>
  );
}
