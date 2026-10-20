'use client';

import React, { memo } from 'react';
import clsx from 'clsx';
import { formatShortDate } from '@/lib/dates';
import { WeekInfo } from '@/lib/types';

export interface WeekCellProps {
  info: WeekInfo;
  onSelect: (info: WeekInfo) => void;
  onHover?: (info: WeekInfo | null) => void;
  isSelected?: boolean;
}

export const WeekCell = memo(function WeekCell({
  info,
  onSelect,
  onHover,
  isSelected,
}: WeekCellProps) {
  const {
    yearIndex,
    weekOfYear,
    startDate,
    endDate,
    isPast,
    isCurrent,
    isFuture,
    hasMemory,
  } = info;

  const dateLabel = `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`;
  const statusText = isCurrent ? 'Current week' : isPast ? 'Past week' : 'Future week';
  const ariaLabel = `Age ${yearIndex}, Week ${weekOfYear + 1}: ${dateLabel}. ${statusText}.${
    hasMemory ? ' Has saved memory.' : ''
  }`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(info);
    }
  };

  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={() => onSelect(info)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover?.(info)}
      onMouseLeave={() => onHover?.(null)}
      className={clsx(
        'relative w-full aspect-square min-w-[2.5px] max-w-[18px] rounded-[1.5px] transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D49B4B] focus-visible:z-20',
        {
          // Past week: solid dark slate gray with subtle border
          'bg-[#262626] border border-white/[0.08] hover:bg-[#383838] hover:border-white/25 hover:scale-125 hover:z-10':
            isPast && !isCurrent,

          // Current week: unmistakable glowing amber accent with subtle pulse
          'bg-[#D49B4B] border border-[#F2F0EA] current-week-pulse scale-110 z-10 hover:scale-135':
            isCurrent,

          // Future week: quiet, faint dark box
          'bg-[#101010] border border-white/[0.05] hover:bg-[#181818] hover:border-white/15 hover:scale-125 hover:z-10':
            isFuture,

          // Currently selected highlight
          'ring-2 ring-white ring-offset-1 ring-offset-[#090909] scale-125 z-20':
            isSelected,
        }
      )}
    >
      {/* Memory pip indicator */}
      {hasMemory && (
        <span
          className={clsx(
            'absolute inset-0 m-auto rounded-full pointer-events-none',
            isCurrent
              ? 'w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#090909]'
              : 'w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#D49B4B] shadow-[0_0_3px_rgba(212,155,75,0.9)]'
          )}
          aria-hidden="true"
        />
      )}
    </button>
  );
});
