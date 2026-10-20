'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Calendar, Heart, Hourglass } from 'lucide-react';
import { LifeStats } from '@/lib/types';
import { getNextBirthday } from '@/lib/life-calculations';
import { parseISO } from 'date-fns';

export interface LiveStatisticsProps {
  stats: LifeStats;
  dob: string;
}

export function LiveStatistics({ stats, dob }: LiveStatisticsProps) {
  const [countdown, setCountdown] = useState(stats.nextBirthday);

  useEffect(() => {
    if (!dob) return;
    const parsedDob = parseISO(dob);

    const interval = setInterval(() => {
      const updated = getNextBirthday(parsedDob, new Date());
      setCountdown(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [dob]);

  return (
    <section aria-label="Life Statistics" className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Weeks Lived */}
        <div className="bg-[#121212] border border-white/10 rounded-xl p-3 sm:py-3.5 sm:px-4 flex flex-col justify-between hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-[#8B8984] mb-1">
            <span className="uppercase tracking-wider">Weeks Lived</span>
            <Calendar className="w-3.5 h-3.5 text-[#D49B4B]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F2F0EA] tracking-tight">
              {stats.weeksLived.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#5C5A55] mt-0.5">
              ~{stats.percentageLived}% of {stats.totalLifespanWeeks.toLocaleString()} est. weeks
            </div>
          </div>
        </div>

        {/* Days Lived */}
        <div className="bg-[#121212] border border-white/10 rounded-xl p-3 sm:py-3.5 sm:px-4 flex flex-col justify-between hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-[#8B8984] mb-1">
            <span className="uppercase tracking-wider">Days Lived</span>
            <Heart className="w-3.5 h-3.5 text-rose-400/80" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F2F0EA] tracking-tight">
              {stats.daysLived.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#5C5A55] mt-0.5">
              Elapsed calendar days
            </div>
          </div>
        </div>

        {/* Current Age */}
        <div className="bg-[#121212] border border-white/10 rounded-xl p-3 sm:py-3.5 sm:px-4 flex flex-col justify-between hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-[#8B8984] mb-1">
            <span className="uppercase tracking-wider">Current Age</span>
            <Clock className="w-3.5 h-3.5 text-[#8B8984]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F2F0EA] tracking-tight">
              {stats.currentAgeYears} <span className="text-xs font-sans text-[#8B8984]">yrs</span>
            </div>
            <div className="text-[10px] text-[#5C5A55] mt-0.5 truncate">
              {stats.currentAgeFormatted}
            </div>
          </div>
        </div>

        {/* Next Birthday Live Countdown */}
        <div className="bg-[#121212] border border-white/10 rounded-xl p-3 sm:py-3.5 sm:px-4 flex flex-col justify-between hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-[#8B8984] mb-1">
            <span className="uppercase tracking-wider">Next Birthday (Turn {countdown.turningAge})</span>
            <Hourglass className="w-3.5 h-3.5 text-[#D49B4B] animate-pulse" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-mono text-[#F2F0EA] tracking-tight">
              {countdown.daysRemaining}d {String(countdown.hoursRemaining).padStart(2, '0')}h{' '}
              <span className="text-[#8B8984] text-sm">
                {String(countdown.minutesRemaining).padStart(2, '0')}m {String(countdown.secondsRemaining).padStart(2, '0')}s
              </span>
            </div>
            <div className="text-[10px] text-[#5C5A55] mt-0.5">
              Until next orbit completed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
