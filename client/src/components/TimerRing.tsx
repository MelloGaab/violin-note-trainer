/**
 * TimerRing.tsx — Violin Note Trainer
 * Compact circular SVG timer positioned in the staff area corner.
 * Design: "Partitura Viva"
 */

import { motion } from 'framer-motion';

interface TimerRingProps {
  progress: number; // 0 to 1 (1 = full, 0 = empty)
  timeLeft: number;
  isRunning: boolean;
  isManual: boolean;
}

const SIZE = 56;
const STROKE = 4;
const RADIUS = (SIZE - STROKE * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TimerRing({ progress, timeLeft, isRunning, isManual }: TimerRingProps) {
  if (isManual || !isRunning) return null;

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = timeLeft <= 2;

  const color = isUrgent
    ? 'oklch(0.55 0.22 25)'
    : progress > 0.5
    ? 'oklch(0.45 0.18 145)'
    : 'oklch(0.65 0.18 60)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="oklch(0.88 0.01 85)"
          strokeWidth={STROKE}
        />
        {/* Progress arc */}
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          animate={{ strokeDashoffset, stroke: color }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </svg>
      {/* Time label */}
      <span
        className={`absolute text-sm font-bold font-mono transition-colors ${
          isUrgent ? 'text-red-500' : 'text-[oklch(0.30_0.04_260)]'
        }`}
      >
        {timeLeft}
      </span>
    </div>
  );
}
