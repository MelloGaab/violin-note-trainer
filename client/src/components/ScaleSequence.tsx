/**
 * ScaleSequence.tsx — Violin Note Trainer
 * Displays a scale sequence on the staff with visual feedback for each note.
 * Design: "Partitura Viva"
 */

import { motion } from 'framer-motion';
import type { Note, Scale } from '@/lib/musicData';
import { getScaleNotes } from '@/lib/musicData';

interface ScaleSequenceProps {
  scale: Scale;
  currentNoteIndex: number;
  completedNoteIndices: number[];
  errorNoteIndices: number[];
}

const STAFF_HEIGHT = 200;
const STAFF_Y_START = 50;
const LINE_SPACING = 20;
const STAFF_WIDTH = 600;
const NOTE_RADIUS = 8;

export default function ScaleSequence({
  scale,
  currentNoteIndex,
  completedNoteIndices,
  errorNoteIndices,
}: ScaleSequenceProps) {
  const notes = getScaleNotes(scale);

  // Calculate Y position for a note on the staff
  const getYPosition = (note: Note): number => {
    return STAFF_Y_START + (10 - note.staffPosition) * LINE_SPACING;
  };

  // Calculate X position for each note in the sequence
  const getXPosition = (index: number): number => {
    const spacing = STAFF_WIDTH / (notes.length + 1);
    return spacing * (index + 1);
  };

  // Determine note color based on state
  const getNoteColor = (index: number): string => {
    if (errorNoteIndices.includes(index)) return 'oklch(0.55 0.22 25)'; // Red
    if (completedNoteIndices.includes(index)) return 'oklch(0.45 0.18 145)'; // Green
    if (index === currentNoteIndex) return 'oklch(0.65 0.18 60)'; // Yellow (current)
    return 'oklch(0.25 0.04 260)'; // Navy (upcoming)
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Scale info header */}
      <div className="flex items-center justify-between px-4">
        <div>
          <h3 className="text-lg font-bold text-[oklch(0.20_0.04_260)]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {scale.displayName}
          </h3>
          <p className="text-xs text-[oklch(0.55_0.04_260)]">{scale.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-[oklch(0.25_0.04_260)]">
            {currentNoteIndex + 1} / {notes.length}
          </div>
          <div className="text-xs text-[oklch(0.60_0.04_260)]">
            {completedNoteIndices.length} acertos
          </div>
        </div>
      </div>

      {/* Staff with scale sequence */}
      <div className="bg-[oklch(0.99_0.008_85)] rounded-xl p-4 border border-[oklch(0.90_0.01_85)] overflow-x-auto">
        <svg width={STAFF_WIDTH + 40} height={STAFF_HEIGHT} className="mx-auto">
          {/* Staff lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`line-${i}`}
              x1="20"
              y1={STAFF_Y_START + i * LINE_SPACING * 2}
              x2={STAFF_WIDTH + 20}
              y2={STAFF_Y_START + i * LINE_SPACING * 2}
              stroke="oklch(0.25 0.04 260)"
              strokeWidth="1.5"
            />
          ))}

          {/* Treble clef */}
          <text
            x="25"
            y={STAFF_Y_START + 60}
            fontSize="48"
            fontFamily="serif"
            fill="oklch(0.25 0.04 260)"
          >
            𝄞
          </text>

          {/* Scale notes */}
          {notes.map((note, index) => {
            const x = getXPosition(index);
            const y = getYPosition(note);
            const isError = errorNoteIndices.includes(index);
            const isCompleted = completedNoteIndices.includes(index);
            const isCurrent = index === currentNoteIndex;
            const color = getNoteColor(index);

            return (
              <g key={`note-${index}`}>
                {/* Ledger lines if needed */}
                {note.ledgerLines.map((ledgerPos) => (
                  <line
                    key={`ledger-${ledgerPos}`}
                    x1={x - 12}
                    y1={STAFF_Y_START + (10 - ledgerPos) * LINE_SPACING}
                    x2={x + 12}
                    y2={STAFF_Y_START + (10 - ledgerPos) * LINE_SPACING}
                    stroke="oklch(0.70 0.01 85)"
                    strokeWidth="1"
                  />
                ))}

                {/* Note head */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={NOTE_RADIUS}
                  fill={color}
                  animate={{
                    r: isCurrent ? 10 : NOTE_RADIUS,
                    opacity: isError ? 0.6 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Note stem */}
                <line
                  x1={x + NOTE_RADIUS}
                  y1={y}
                  x2={x + NOTE_RADIUS}
                  y2={y - 35}
                  stroke={color}
                  strokeWidth="2"
                />

                {/* Completion checkmark */}
                {isCompleted && (
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <circle
                      cx={x}
                      cy={y - 45}
                      r="10"
                      fill="oklch(0.45 0.18 145)"
                    />
                    <text
                      x={x}
                      y={y - 40}
                      fontSize="14"
                      fontWeight="bold"
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      ✓
                    </text>
                  </motion.g>
                )}

                {/* Error indicator */}
                {isError && (
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <circle
                      cx={x}
                      cy={y - 45}
                      r="10"
                      fill="oklch(0.55 0.22 25)"
                    />
                    <text
                      x={x}
                      y={y - 40}
                      fontSize="14"
                      fontWeight="bold"
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      ✕
                    </text>
                  </motion.g>
                )}

                {/* Current note indicator */}
                {isCurrent && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={NOTE_RADIUS + 8}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    animate={{ r: [NOTE_RADIUS + 8, NOTE_RADIUS + 12] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}

                {/* Note label below staff */}
                <text
                  x={x}
                  y={STAFF_Y_START + 110}
                  fontSize="11"
                  fontFamily="'DM Mono', monospace"
                  fontWeight="600"
                  fill={color}
                  textAnchor="middle"
                >
                  {note.displayName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Progress bar */}
      <div className="px-4">
        <div className="w-full bg-[oklch(0.92_0.01_85)] rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-[oklch(0.65_0.18_60)] to-[oklch(0.45_0.18_145)] h-full"
            animate={{
              width: `${((completedNoteIndices.length + 0.5) / notes.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
