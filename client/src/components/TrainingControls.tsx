/**
 * TrainingControls.tsx — Violin Note Trainer
 * Design: "Partitura Viva" — Left panel with training mode, string, and timer controls
 */

import { Play, Square, SkipForward, Music, Clock, Guitar } from 'lucide-react';
import type { TrainerSettings } from '@/hooks/useTrainer';
import type { ViolinString, TrainingMode } from '@/lib/musicData';

interface TrainingControlsProps {
  settings: TrainerSettings;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onNext: () => void;
  onUpdateSettings: (updates: Partial<TrainerSettings>) => void;
}

const TRAINING_MODES: { value: TrainingMode; label: string; desc: string; icon: string }[] = [
  { value: 'basic', label: 'Básico', desc: 'Notas naturais', icon: '♩' },
  { value: 'intermediate', label: 'Intermediário', desc: 'Com ♯ e ♭', icon: '♪' },
  { value: 'advanced', label: 'Avançado', desc: 'Todas as oitavas', icon: '♫' },
];

const TIMER_OPTIONS = [
  { value: 3 as const, label: '3s' },
  { value: 5 as const, label: '5s' },
  { value: 7 as const, label: '7s' },
  { value: 10 as const, label: '10s' },
  { value: 'manual' as const, label: 'Manual' },
];

const STRING_OPTIONS: { value: ViolinString | 'all'; label: string; color: string; note: string }[] = [
  { value: 'all', label: 'Todas', color: '#4a6fa5', note: '' },
  { value: 'G', label: 'Sol', color: '#8B4513', note: 'G' },
  { value: 'D', label: 'Ré', color: '#B8860B', note: 'D' },
  { value: 'A', label: 'Lá', color: '#708090', note: 'A' },
  { value: 'E', label: 'Mi', color: '#9a9a9a', note: 'E' },
];

const BASE = 'text-left px-3 py-2 rounded-lg border transition-all duration-150 text-sm';
const ACTIVE = 'bg-[oklch(0.22_0.04_260)] text-[oklch(0.97_0.012_85)] border-[oklch(0.22_0.04_260)]';
const INACTIVE = 'bg-transparent text-[oklch(0.35_0.04_260)] border-[oklch(0.88_0.01_85)] hover:border-[oklch(0.60_0.04_260)] hover:bg-[oklch(0.94_0.01_85)]';
const DISABLED = 'opacity-40 cursor-not-allowed pointer-events-none';

export default function TrainingControls({
  settings,
  isRunning,
  onStart,
  onStop,
  onNext,
  onUpdateSettings,
}: TrainingControlsProps) {
  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Training Mode */}
      <section>
        <SectionLabel icon={<Music size={12} />} label="Modo de Treino" />
        <div className="flex flex-col gap-1">
          {TRAINING_MODES.map(mode => (
            <button
              key={mode.value}
              onClick={() => !isRunning && onUpdateSettings({ trainingMode: mode.value })}
              className={`${BASE} ${settings.trainingMode === mode.value ? ACTIVE : INACTIVE} ${isRunning ? DISABLED : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none opacity-70">{mode.icon}</span>
                <div>
                  <div className="font-medium text-xs leading-tight">{mode.label}</div>
                  <div className={`text-[10px] mt-0.5 ${settings.trainingMode === mode.value ? 'text-[oklch(0.78_0.02_85)]' : 'text-[oklch(0.62_0.02_85)]'}`}>
                    {mode.desc}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* String Filter */}
      <section>
        <SectionLabel icon={<Guitar size={12} />} label="Corda" />
        <div className="flex flex-col gap-1">
          {STRING_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => !isRunning && onUpdateSettings({ stringFilter: opt.value })}
              className={`${BASE} ${settings.stringFilter === opt.value ? ACTIVE : INACTIVE} ${isRunning ? DISABLED : ''} flex items-center gap-2`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: opt.color }}
              />
              <span className="text-xs font-medium">{opt.label}</span>
              {opt.note && (
                <span className={`text-[10px] ml-auto font-mono ${settings.stringFilter === opt.value ? 'text-[oklch(0.78_0.02_85)]' : 'text-[oklch(0.62_0.02_85)]'}`}>
                  {opt.note}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Timer */}
      <section>
        <SectionLabel icon={<Clock size={12} />} label="Timer" />
        <div className="grid grid-cols-2 gap-1">
          {TIMER_OPTIONS.map(opt => (
            <button
              key={String(opt.value)}
              onClick={() => !isRunning && onUpdateSettings({ timerMode: opt.value })}
              className={`
                px-2 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 text-center
                ${settings.timerMode === opt.value ? ACTIVE : INACTIVE}
                ${isRunning ? DISABLED : ''}
                ${opt.value === 'manual' ? 'col-span-2' : ''}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="w-full bg-[oklch(0.22_0.04_260)] hover:bg-[oklch(0.18_0.04_260)] text-[oklch(0.97_0.012_85)] h-10 rounded-xl font-semibold text-sm tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play size={14} />
            Iniciar Treino
          </button>
        ) : (
          <>
            {settings.timerMode === 'manual' && (
              <button
                onClick={onNext}
                className="w-full border border-[oklch(0.22_0.04_260)] text-[oklch(0.22_0.04_260)] hover:bg-[oklch(0.94_0.01_85)] h-9 rounded-xl text-xs font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <SkipForward size={13} />
                Próxima
              </button>
            )}
            <button
              onClick={onStop}
              className="w-full border border-red-300 text-red-600 hover:bg-red-50 h-9 rounded-xl text-xs font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Square size={13} />
              Parar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-[oklch(0.50_0.04_260)]">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.55_0.04_260)]">
        {label}
      </span>
    </div>
  );
}
