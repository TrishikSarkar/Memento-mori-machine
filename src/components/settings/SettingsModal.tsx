'use client';

import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, AlertTriangle, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserSettings, LifeMemory, CustomMilestone, ExportData } from '@/lib/types';
import { validateDateOfBirth } from '@/lib/life-calculations';
import { createExportPayload, downloadExportJson, validateImportJson } from '@/lib/export-import';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  memories: LifeMemory[];
  milestones: CustomMilestone[];
  onSaveSettings: (newSettings: UserSettings) => void;
  onImportData: (importedData: ExportData) => void;
  onResetAllData: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  memories,
  milestones,
  onSaveSettings,
  onImportData,
  onResetAllData,
}: SettingsModalProps) {
  const [dob, setDob] = useState(settings.dob);
  const [lifespan, setLifespan] = useState(settings.lifespanYears);
  const [showChapters, setShowChapters] = useState(settings.showChapterLabels);
  const [reducedMotion, setReducedMotion] = useState(settings.reducedMotion);

  const [dobError, setDobError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDobError(null);
    setSaveSuccess(false);

    const validation = validateDateOfBirth(dob);
    if (!validation.isValid) {
      setDobError(validation.error || 'Invalid date of birth');
      return;
    }

    onSaveSettings({
      ...settings,
      dob,
      lifespanYears: lifespan,
      showChapterLabels: showChapters,
      reducedMotion,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExport = () => {
    const payload = createExportPayload(
      {
        ...settings,
        dob,
        lifespanYears: lifespan,
        showChapterLabels: showChapters,
        reducedMotion,
      },
      memories,
      milestones
    );
    downloadExportJson(payload);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = validateImportJson(text);

        if (!result.isValid || !result.data) {
          setImportError(result.error || 'Failed to validate imported file.');
          return;
        }

        onImportData(result.data);
        setDob(result.data.settings.dob);
        setLifespan(result.data.settings.lifespanYears);
        setShowChapters(result.data.settings.showChapterLabels);
        setReducedMotion(result.data.settings.reducedMotion);
        setImportSuccess(
          `Successfully restored ${result.data.memories.length} memories and settings.`
        );
      } catch {
        setImportError('An unexpected error occurred while reading the file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings & Privacy"
      subtitle="Manage your timeline, visualization preferences, and browser data."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-5 pb-5 border-b border-white/5">
          <Input
            label="Date of Birth"
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              if (dobError) setDobError(null);
            }}
            max={new Date().toISOString().split('T')[0]}
            error={dobError || undefined}
            helperText="Used to accurately map elapsed weeks on the grid."
            required
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="settings-lifespan" className="text-xs font-medium text-[#8B8984] uppercase tracking-wider">
                Estimated Lifespan
              </label>
              <span className="text-sm font-mono text-[#D49B4B]">{lifespan} years</span>
            </div>
            <input
              id="settings-lifespan"
              type="range"
              min={50}
              max={110}
              step={1}
              value={lifespan}
              onChange={(e) => setLifespan(Number(e.target.value))}
              className="w-full h-1.5 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#D49B4B]"
            />
            <p className="text-[11px] text-[#5C5A55]">
              Adjusts the total number of rows on your canvas (52 weeks per year).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Show chapters toggle */}
            <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]">
              <div>
                <span className="text-xs font-medium text-[#F2F0EA] block">
                  Show Life Chapter Dividers
                </span>
                <span className="text-[11px] text-[#8B8984]">
                  Subtle markers for Childhood, Adolescence, Early Adulthood, Midlife, and Later Life.
                </span>
              </div>
              <input
                type="checkbox"
                checked={showChapters}
                onChange={(e) => setShowChapters(e.target.checked)}
                className="w-4 h-4 accent-[#D49B4B] rounded cursor-pointer"
              />
            </label>

            {/* Reduced motion toggle */}
            <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]">
              <div>
                <span className="text-xs font-medium text-[#F2F0EA] block">
                  Reduced Visual Effects
                </span>
                <span className="text-[11px] text-[#8B8984]">
                  Disable pulses, animations, and transitions for an ultra-still editorial view.
                </span>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-[#D49B4B] rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Preferences updated successfully
              </span>
            ) : (
              <div />
            )}

            <Button variant="amber" size="sm" type="submit">
              Save Preferences
            </Button>
          </div>
        </form>

        {/* Data Backup & Restore */}
        <div className="space-y-3 pb-5 border-b border-white/5">
          <h4 className="text-xs font-semibold text-[#8B8984] uppercase tracking-wider">
            Data Backup & Portability
          </h4>
          <p className="text-xs text-[#8B8984] leading-relaxed">
            Because Memento Mori Machine saves your data strictly in local storage, clearing your browser history will erase it. Download a JSON backup to keep your timeline safe.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-[#D49B4B]" />
              <span>Export Backup (.JSON)</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5 text-[#8B8984]" />
              <span>Import Backup</span>
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
          </div>

          {importSuccess && (
            <p className="text-xs text-emerald-400 mt-2">{importSuccess}</p>
          )}
          {importError && (
            <p className="text-xs text-red-400 mt-2">{importError}</p>
          )}
        </div>

        {/* Danger Zone: Reset */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">
            Danger Zone
          </h4>

          {!showResetConfirm ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Data & Clear Machine</span>
            </Button>
          ) : (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-200">
                  <p className="font-semibold mb-1">Are you sure you want to erase everything?</p>
                  <p className="text-red-300/80">
                    This will wipe all memories, settings, and horizons from your local browser. This action cannot be undone unless you have exported a JSON backup.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  type="button"
                  onClick={() => {
                    onResetAllData();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                >
                  Yes, Erase Everything
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
