'use client';

import React, { useState, useMemo } from 'react';
import { Search, Trash2, PenLine, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { LifeMemory } from '@/lib/types';
import { formatFullDate } from '@/lib/dates';

export interface MemoryArchiveProps {
  memories: LifeMemory[];
  onSelectMemoryWeek: (yearIndex: number, weekIndex: number) => void;
  onEditMemory: (memory: LifeMemory) => void;
  onDeleteMemory: (memoryId: string) => void;
}

export function MemoryArchive({
  memories,
  onSelectMemoryWeek,
  onEditMemory,
  onDeleteMemory,
}: MemoryArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sort memories chronologically by total week number
  const sortedMemories = useMemo(() => {
    return [...memories].sort((a, b) => a.totalWeekNumber - b.totalWeekNumber);
  }, [memories]);

  // Filter memories by search query
  const filteredMemories = useMemo(() => {
    if (!searchQuery.trim()) return sortedMemories;
    const q = searchQuery.toLowerCase();
    return sortedMemories.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.note.toLowerCase().includes(q) ||
        `age ${m.yearIndex}`.includes(q)
    );
  }, [sortedMemories, searchQuery]);

  return (
    <section id="memories-section" aria-label="Memory Archive" className="w-full space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D49B4B] block mb-1">
            Weeks Worth Remembering
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F2F0EA] font-normal tracking-tight">
            The memories you chose to keep from the flow of time.
          </h2>
        </div>

        {/* Search Input */}
        {memories.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8B8984] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#121212] border border-white/10 rounded-lg text-xs text-[#F2F0EA] placeholder:text-[#5C5A55] focus:outline-none focus:border-[#D49B4B]"
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {memories.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-[#121212] border border-dashed border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#D49B4B]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-serif text-lg text-[#F2F0EA]">No memories anchored yet</h3>
            <p className="text-xs sm:text-sm text-[#8B8984] leading-relaxed">
              Every week in your life grid can hold a memory. Click on any past square to immortalize a milestone, a crossroad, a triumph, or a quiet week you loved.
            </p>
          </div>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="p-8 text-center text-xs text-[#8B8984] bg-[#121212] rounded-xl border border-white/10">
          No memories match &ldquo;{searchQuery}&rdquo;.
        </div>
      ) : (
        /* Memories Timeline / Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((mem) => {
            const isDeleting = confirmDeleteId === mem.id;

            return (
              <div
                key={mem.id}
                className="group relative p-5 rounded-xl bg-[#121212] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#D49B4B] bg-[#D49B4B]/10 px-2 py-0.5 rounded border border-[#D49B4B]/30">
                        Age {mem.yearIndex} · W{mem.weekIndex + 1}
                      </span>
                      {mem.specificDate && (
                        <span className="text-xs text-[#8B8984]">
                          {formatFullDate(mem.specificDate)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onSelectMemoryWeek(mem.yearIndex, mem.weekIndex)}
                        className="text-[#8B8984] hover:text-[#F2F0EA] p-1.5 rounded hover:bg-white/5 transition-colors"
                        title="Highlight week in grid"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditMemory(mem)}
                        className="text-[#8B8984] hover:text-[#F2F0EA] p-1.5 rounded hover:bg-white/5 transition-colors"
                        title="Edit memory"
                      >
                        <PenLine className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(mem.id)}
                        className="text-[#8B8984] hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition-colors"
                        title="Delete memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-serif text-lg text-[#F2F0EA] font-medium mt-3 leading-snug">
                    {mem.title}
                  </h4>

                  {mem.note && (
                    <p className="text-xs sm:text-sm text-[#8B8984] leading-relaxed mt-2 whitespace-pre-wrap">
                      {mem.note}
                    </p>
                  )}
                </div>

                {/* Inline confirmation for deletion */}
                {isDeleting && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 flex items-center justify-between text-xs animate-in fade-in">
                    <span className="text-red-200">Delete this memory permanently?</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDeleteId(null)}
                        className="h-6 px-2 text-[11px]"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          onDeleteMemory(mem.id);
                          setConfirmDeleteId(null);
                        }}
                        className="h-6 px-2 text-[11px]"
                      >
                        Confirm Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
