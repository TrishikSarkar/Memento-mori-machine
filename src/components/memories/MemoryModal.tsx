'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LifeMemory, WeekInfo } from '@/lib/types';
import { formatWeekRange } from '@/lib/dates';

export interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekInfo: WeekInfo | null;
  existingMemory?: LifeMemory | null;
  onSave: (memoryData: {
    title: string;
    note: string;
    specificDate?: string;
  }) => void;
}

export function MemoryModal({
  isOpen,
  onClose,
  weekInfo,
  existingMemory,
  onSave,
}: MemoryModalProps) {
  const [title, setTitle] = useState(existingMemory?.title || '');
  const [note, setNote] = useState(existingMemory?.note || '');
  const [specificDate, setSpecificDate] = useState(existingMemory?.specificDate || '');
  const [error, setError] = useState<string | null>(null);

  if (!weekInfo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for this memory.');
      return;
    }

    onSave({
      title: title.trim(),
      note: note.trim(),
      specificDate: specificDate || undefined,
    });

    onClose();
  };

  const isEditing = Boolean(existingMemory);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Memory' : 'Anchor a Memory'}
      subtitle={`Age ${weekInfo.yearIndex} · Week ${weekInfo.weekOfYear + 1} (${formatWeekRange(
        weekInfo.startDate,
        weekInfo.endDate
      )})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g., Moved to Berlin, Finished First Novel, Mountain hike"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          error={error || undefined}
          autoFocus
          required
        />

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#8B8984] uppercase tracking-wider">
            Reflections & Notes
          </label>
          <textarea
            rows={4}
            placeholder="What made this week distinct? What changed, what stayed the same, what do you wish to remember?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-[#121212] text-[#F2F0EA] border border-white/10 hover:border-white/20 rounded-lg p-3 text-sm transition-colors duration-150 placeholder:text-[#5C5A55] focus:outline-none focus:border-[#D49B4B] focus:ring-1 focus:ring-[#D49B4B]"
          />
        </div>

        <Input
          label="Specific Date within this week (Optional)"
          type="date"
          value={specificDate}
          onChange={(e) => setSpecificDate(e.target.value)}
          min={weekInfo.startDate.toISOString().split('T')[0]}
          max={weekInfo.endDate.toISOString().split('T')[0]}
          helperText="Optional specific calendar date within this week range."
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" size="sm" type="submit">
            {isEditing ? 'Update Memory' : 'Save to Canvas'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
