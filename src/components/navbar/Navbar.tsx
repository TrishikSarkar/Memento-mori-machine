'use client';

import React from 'react';
import { Settings, ShieldCheck, Calendar, BookOpen, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

export interface NavbarProps {
  currentWeekNumber?: number;
  onOpenSettings: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export function Navbar({ currentWeekNumber, onOpenSettings, onNavigateToSection }: NavbarProps) {
  const scrollTo = (id: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090909]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D49B4B] shadow-[0_0_8px_rgba(212,155,75,0.6)]" />
            <a
              href="#"
              className="font-serif text-base sm:text-lg tracking-tight font-medium text-[#F2F0EA] hover:text-[#D49B4B] transition-colors"
            >
              Memento Mori Machine
            </a>
          </div>

          {currentWeekNumber !== undefined && currentWeekNumber > 0 && (
            <span className="hidden md:inline-flex text-[11px] font-mono uppercase tracking-widest text-[#8B8984] px-2 py-0.5 rounded bg-white/5 border border-white/5">
              Week {currentWeekNumber.toLocaleString()}
            </span>
          )}
        </div>

        {/* Section Navigation */}
        <nav className="hidden sm:flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => scrollTo('life-grid-section')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#8B8984] hover:text-[#F2F0EA] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>The Grid</span>
          </button>
          <button
            type="button"
            onClick={() => scrollTo('perspective-section')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#8B8984] hover:text-[#F2F0EA] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Perspective</span>
          </button>
          <button
            type="button"
            onClick={() => scrollTo('memories-section')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#8B8984] hover:text-[#F2F0EA] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Memories</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#5C5A55] tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B8984]" />
            <span>Private & Local</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenSettings}
            className="border-white/10 hover:border-white/20 text-xs px-3"
            aria-label="Open settings"
          >
            <Settings className="w-3.5 h-3.5 text-[#8B8984]" />
            <span className="hidden xs:inline">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
