'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CustomMilestone } from '@/lib/types';
import { calculateMilestoneDiff, formatFullDate } from '@/lib/dates';

export interface MilestoneCalculatorProps {
  milestones: CustomMilestone[];
  onAddMilestone: (milestone: Omit<CustomMilestone, 'id'>) => void;
  onDeleteMilestone: (id: string) => void;
}

export function MilestoneCalculator({
  milestones,
  onAddMilestone,
  onDeleteMilestone,
}: MilestoneCalculatorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a milestone title.');
      return;
    }
    if (!targetDate) {
      setError('Please pick a target date.');
      return;
    }

    onAddMilestone({
      title: title.trim(),
      targetDate,
      description: description.trim() || undefined,
    });

    setTitle('');
    setTargetDate('');
    setDescription('');
    setShowAddForm(false);
    setError(null);
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#D49B4B]" />
            <h3 className="font-serif text-xl text-[#F2F0EA] font-medium">
              Milestone Distance Calculator
            </h3>
          </div>
          <p className="text-xs text-[#8B8984] mt-1">
            Measure the exact weeks and days between today and meaningful horizons.
          </p>
        </div>

        {!showAddForm && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#D49B4B]" />
            <span>Add Milestone</span>
          </Button>
        )}
      </div>

      {/* Add Milestone Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="p-4 rounded-xl bg-[#161616] border border-white/10 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#8B8984] uppercase tracking-wider">
              New Personal Horizon
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-[#8B8984] hover:text-[#F2F0EA]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Milestone Title"
              placeholder="e.g., Turning 40, Degree Completion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Target Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <Input
            label="Optional Reflection or Context"
            placeholder="A short note on why this point in time matters to you"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button variant="amber" size="sm" type="submit">
              Save Horizon
            </Button>
          </div>
        </form>
      )}

      {/* Milestone Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {milestones.map((ms) => {
          const diff = calculateMilestoneDiff(ms.targetDate);
          if (!diff) return null;

          return (
            <div
              key={ms.id}
              className="group relative p-4 rounded-xl bg-[#161616] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif text-base text-[#F2F0EA] font-medium leading-snug">
                    {ms.title}
                  </h4>
                  <button
                    type="button"
                    onClick={() => onDeleteMilestone(ms.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#5C5A55] hover:text-red-400 p-1 rounded transition-opacity"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-[#8B8984] mt-1">
                  {formatFullDate(ms.targetDate)}
                </div>

                {ms.description && (
                  <p className="text-xs text-[#5C5A55] mt-2 line-clamp-2 italic">
                    &ldquo;{ms.description}&rdquo;
                  </p>
                )}
              </div>

              <div className="pt-4 mt-3 border-t border-white/5">
                <div className="text-xl font-serif text-[#D49B4B]">
                  {diff.weeks.toLocaleString()}{' '}
                  <span className="text-xs font-sans text-[#8B8984]">
                    weeks, {diff.remainingDays} days
                  </span>
                </div>
                <div className="text-[11px] text-[#5C5A55] mt-0.5">
                  {diff.isPast ? 'Elapsed since this date' : 'Remaining until this horizon'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
