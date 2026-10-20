import React from 'react';

export function GridLegend() {
  return (
    <div
      aria-label="Grid Legend"
      className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs text-[#8B8984] py-2"
    >
      {/* Past week */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-[2px] bg-[#2A2A2A] border border-white/20" />
        <span>Past week</span>
      </div>

      {/* Current week */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-[2px] bg-[#D49B4B] shadow-[0_0_6px_rgba(212,155,75,0.7)]" />
        <span className="text-[#F2F0EA] font-medium">Current week</span>
      </div>

      {/* Future week */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-[2px] bg-[#121212] border border-white/10" />
        <span>Estimated future</span>
      </div>

      {/* Week with memory */}
      <div className="flex items-center gap-2">
        <div className="relative w-3 h-3 rounded-[2px] bg-[#2A2A2A] border border-[#D49B4B]/60 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D49B4B]" />
        </div>
        <span>Week with memory</span>
      </div>
    </div>
  );
}
