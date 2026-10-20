'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { validateDateOfBirth, DEFAULT_LIFESPAN } from '@/lib/life-calculations';

export interface OnboardingProps {
  isOpen: boolean;
  onComplete: (dob: string, lifespan: number) => void;
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingProps) {
  const [dob, setDob] = useState('');
  const [lifespan, setLifespan] = useState(DEFAULT_LIFESPAN);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateDateOfBirth(dob);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid date of birth.');
      return;
    }

    onComplete(dob, lifespan);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#090909]"
      role="dialog"
      aria-modal="true"
    >
      {/* Subtle atmospheric radial background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(212, 155, 75, 0.08), transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl p-7 sm:p-10 shadow-2xl text-[#F2F0EA]">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#8B8984] mb-6 tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#D49B4B]" />
          <span>A Quiet Perspective</span>
        </div>

        {/* Vision Header */}
        <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-[#F2F0EA] leading-tight mb-3">
          Time is the thing we have.
        </h1>

        <p className="text-sm sm:text-base text-[#8B8984] leading-relaxed mb-8 font-light">
          A quiet little machine for seeing your life in weeks, and remembering that each one matters.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="When were you born?"
              type="date"
              id="onboarding-dob"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                if (error) setError(null);
              }}
              error={error || undefined}
              max={new Date().toISOString().split('T')[0]}
              helperText="Used solely to count elapsed calendar weeks."
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="onboarding-lifespan" className="text-xs font-medium text-[#8B8984] uppercase tracking-wider">
                Estimated Lifespan
              </label>
              <span className="text-sm font-mono text-[#D49B4B]">{lifespan} years</span>
            </div>
            <input
              id="onboarding-lifespan"
              type="range"
              min={50}
              max={105}
              step={1}
              value={lifespan}
              onChange={(e) => setLifespan(Number(e.target.value))}
              className="w-full h-1.5 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#D49B4B]"
            />
            <div className="flex justify-between text-[11px] text-[#5C5A55]">
              <span>50 yrs</span>
              <span>80 yrs (standard)</span>
              <span>105 yrs</span>
            </div>
            <p className="text-xs text-[#5C5A55] italic pt-1">
              An estimate for the canvas scale — never a prediction of destiny.
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="amber"
              size="lg"
              className="w-full py-3.5 text-base flex items-center justify-center gap-2"
            >
              <span>See my life</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-[#8B8984]">
            <Shield className="w-4 h-4 text-[#8B8984] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#F2F0EA] font-medium">100% Client-Side Privacy:</strong> Your birth date and memories are stored exclusively in your browser&apos;s local storage. No accounts, no cookies, and no data is ever transmitted to any server.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
