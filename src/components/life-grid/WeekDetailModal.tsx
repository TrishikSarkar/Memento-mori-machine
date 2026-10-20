'use client';

import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, PenLine, Trash2, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatFullDate, formatWeekRange } from '@/lib/dates';
import { LifeMemory, WeekInfo } from '@/lib/types';

export interface WeekDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekInfo: WeekInfo | null;
  memory: LifeMemory | null;
  onAddMemory: (weekInfo: WeekInfo) => void;
  onEditMemory: (memory: LifeMemory) => void;
  onDeleteMemory: (memoryId: string) => void;
  onNavigateWeek?: (direction: -1 | 1) => void;
}

export function WeekDetailModal({
  isOpen,
  onClose,
  weekInfo,
  memory,
  onAddMemory,
  onEditMemory,
  onDeleteMemory,
  onNavigateWeek,
}: WeekDetailModalProps) {
  if (!weekInfo) return null;

  const {
    yearIndex,
    weekOfYear,
    totalWeekIndex,
    startDate,
    endDate,
    isPast,
    isCurrent,
    chapter,
  } = weekInfo;

  const statusVariant = isCurrent ? 'current' : isPast ? 'past' : 'future';
  const statusLabel = isCurrent ? 'Current Week' : isPast ? 'Past Week' : 'Estimated Future';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Age ${yearIndex} · Week ${weekOfYear + 1}`}
      subtitle={`Week ${totalWeekIndex.toLocaleString()} of your life`}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Date range & badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 text-sm text-[#F2F0EA]">
            <Calendar className="w-4 h-4 text-[#D49B4B]" />
            <span className="font-medium">{formatWeekRange(startDate, endDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            {chapter && (
              <Badge variant="chapter">{chapter.name}</Badge>
            )}
          </div>
        </div>

        {/* Memory section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#8B8984] uppercase tracking-wider">
              Attached Memory
            </h4>

            {memory ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditMemory(memory)}
                  className="text-xs h-7 px-2"
                >
                  <PenLine className="w-3 h-3 text-[#D49B4B]" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteMemory(memory.id)}
                  className="text-xs h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </Button>
              </div>
            ) : null}
          </div>

          {memory ? (
            <div className="p-4 rounded-xl bg-[#161616] border border-[#D49B4B]/30 space-y-2">
              <h5 className="font-serif text-base text-[#F2F0EA] font-medium">
                {memory.title}
              </h5>
              {memory.specificDate && (
                <p className="text-xs text-[#D49B4B] font-mono">
                  {formatFullDate(memory.specificDate)}
                </p>
              )}
              <p className="text-sm text-[#8B8984] leading-relaxed whitespace-pre-wrap">
                {memory.note}
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-3">
              <p className="text-xs text-[#8B8984] max-w-xs mx-auto leading-relaxed">
                {isPast || isCurrent
                  ? 'No memory attached yet. Anchor a milestone, thought, or story to this week.'
                  : 'This week lies ahead in your estimated future. You can record an anticipated dream or milestone.'}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAddMemory(weekInfo)}
                className="inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#D49B4B]" />
                <span>Add Memory</span>
              </Button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-[#8B8984]">
          {onNavigateWeek ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateWeek(-1)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#F2F0EA] transition-colors cursor-pointer"
                title="Previous week"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev Week</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateWeek(1)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#F2F0EA] transition-colors cursor-pointer"
                title="Next week"
              >
                <span>Next Week</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div />
          )}

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
