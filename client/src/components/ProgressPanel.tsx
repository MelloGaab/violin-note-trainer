/**
 * ProgressPanel.tsx — Violin Note Trainer
 * Design: "Partitura Viva" — Right panel with session stats, level, and error history
 */

import { motion } from 'framer-motion';
import { Trophy, Target, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { ALL_NOTES } from '@/lib/musicData';
import type { SessionStats } from '@/hooks/useTrainer';

interface ProgressPanelProps {
  sessionStats: SessionStats;
  allTimeStats: SessionStats;
  isRunning: boolean;
}

function getLevel(total: number, accuracy: number): {
  name: string;
  color: string;
  bgColor: string;
  next: number;
  icon: string;
} {
  if (total < 20) return { name: 'Iniciante', color: '#8B7355', bgColor: '#f5f0e8', next: 20, icon: '🌱' };
  if (total < 100 || accuracy < 60) return { name: 'Aprendiz', color: '#5a8a5a', bgColor: '#eef5ee', next: 100, icon: '🎵' };
  if (total < 300 || accuracy < 75) return { name: 'Intermediário', color: '#3a5a8a', bgColor: '#eef0f8', next: 300, icon: '🎼' };
  if (total < 600 || accuracy < 85) return { name: 'Avançado', color: '#6a4a9a', bgColor: '#f0eef8', next: 600, icon: '🎻' };
  return { name: 'Virtuoso', color: '#8a6a20', bgColor: '#f8f4e8', next: Infinity, icon: '🏆' };
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

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-[oklch(0.97_0.012_85)] rounded-xl p-2.5 border border-[oklch(0.90_0.01_85)] text-center">
      <div className="text-[10px] text-[oklch(0.58_0.03_260)] mb-1">{label}</div>
      <div
        className="text-lg font-bold font-mono"
        style={{ color: color ?? 'oklch(0.22 0.04 260)' }}
      >
        {value}
      </div>
    </div>
  );
}

export default function ProgressPanel({ sessionStats, allTimeStats, isRunning }: ProgressPanelProps) {
  const sessionAcc = sessionStats.total > 0
    ? Math.round((sessionStats.correct / sessionStats.total) * 100)
    : 0;

  const allTimeAcc = allTimeStats.total > 0
    ? Math.round((allTimeStats.correct / allTimeStats.total) * 100)
    : 0;

  const avgTime = sessionStats.responseTimes.length > 0
    ? (sessionStats.responseTimes.reduce((a, b) => a + b, 0) / sessionStats.responseTimes.length / 1000).toFixed(1)
    : null;

  const level = getLevel(allTimeStats.total, allTimeAcc);
  const levelProgress = level.next === Infinity
    ? 100
    : Math.min(100, (allTimeStats.total / level.next) * 100);

  const errorEntries = Object.entries(allTimeStats.errorNotes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => ({ id, count, note: ALL_NOTES.find(n => n.id === id) }))
    .filter(e => e.note);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">

      {/* Level */}
      <section>
        <SectionLabel icon={<Trophy size={12} />} label="Nível" />
        <div
          className="rounded-xl p-3 border"
          style={{ backgroundColor: level.bgColor, borderColor: level.color + '40' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{level.icon}</span>
              <span
                className="text-sm font-bold"
                style={{ color: level.color, fontFamily: "'Playfair Display', serif" }}
              >
                {level.name}
              </span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: level.color + 'aa' }}>
              {allTimeStats.total} notas
            </span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-1.5">
            <motion.div
              className="h-1.5 rounded-full"
              style={{ backgroundColor: level.color }}
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>
          {level.next !== Infinity && (
            <div className="text-[10px] mt-1" style={{ color: level.color + '99' }}>
              {level.next - allTimeStats.total} para o próximo nível
            </div>
          )}
        </div>
      </section>

      {/* Session Stats */}
      <section>
        <SectionLabel icon={<TrendingUp size={12} />} label="Esta Sessão" />
        <div className="grid grid-cols-2 gap-1.5">
          <StatBox
            label="Precisão"
            value={sessionStats.total > 0 ? `${sessionAcc}%` : '—'}
            color={sessionAcc >= 80 ? 'oklch(0.40 0.18 145)' : sessionAcc >= 60 ? 'oklch(0.55 0.15 60)' : sessionStats.total > 0 ? 'oklch(0.50 0.22 25)' : undefined}
          />
          <StatBox
            label="Tempo médio"
            value={avgTime ? `${avgTime}s` : '—'}
          />
          <StatBox
            label="Acertos"
            value={String(sessionStats.correct)}
            color="oklch(0.40 0.18 145)"
          />
          <StatBox
            label="Erros"
            value={String(sessionStats.incorrect)}
            color={sessionStats.incorrect > 0 ? 'oklch(0.50 0.22 25)' : undefined}
          />
        </div>
      </section>

      {/* All-time */}
      <section>
        <SectionLabel icon={<Target size={12} />} label="Geral" />
        <div className="bg-[oklch(0.97_0.012_85)] rounded-xl border border-[oklch(0.90_0.01_85)] divide-y divide-[oklch(0.92_0.01_85)]">
          <div className="flex justify-between items-center px-3 py-2">
            <span className="text-xs text-[oklch(0.55_0.04_260)]">Total de notas</span>
            <span className="text-sm font-bold font-mono text-[oklch(0.22_0.04_260)]">{allTimeStats.total}</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2">
            <span className="text-xs text-[oklch(0.55_0.04_260)]">Precisão geral</span>
            <span className="text-sm font-bold font-mono text-[oklch(0.22_0.04_260)]">
              {allTimeStats.total > 0 ? `${allTimeAcc}%` : '—'}
            </span>
          </div>
        </div>
      </section>

      {/* Error history */}
      {errorEntries.length > 0 && (
        <section>
          <SectionLabel icon={<AlertCircle size={12} />} label="Notas Difíceis" />
          <div className="flex flex-col gap-1">
            {errorEntries.map(({ id, count, note }) => (
              <div
                key={id}
                className="flex items-center justify-between bg-[oklch(0.97_0.012_85)] rounded-lg px-3 py-2 border border-[oklch(0.90_0.01_85)]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[oklch(0.22_0.04_260)] font-mono">
                    {note!.displayName}{note!.accidental === '#' ? '♯' : note!.accidental === 'b' ? '♭' : ''}
                  </span>
                  <span className="text-[10px] text-[oklch(0.60_0.04_260)]">
                    {note!.string} str.
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                  {count}×
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {errorEntries.length === 0 && allTimeStats.total === 0 && (
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🎻</div>
            <div className="text-xs text-[oklch(0.62_0.02_85)]">
              Inicie um treino para ver seu progresso
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
