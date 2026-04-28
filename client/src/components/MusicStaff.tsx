/**
 * MusicStaff.tsx — Violin Note Trainer
 * Design: "Partitura Viva" — SVG pentagrama com clave de sol e nota animada
 * Corrected staff positions for treble clef (violin range G3–A5)
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { Note } from '@/lib/musicData';

interface MusicStaffProps {
  note: Note | null;
  feedback: 'none' | 'correct' | 'incorrect';
  showAnswer: boolean;
}

// SVG dimensions
const SVG_W = 520;
const SVG_H = 240;

// Staff geometry
const LINE_SPACING = 18; // pixels between staff lines
const STAFF_TOP = 70;    // y of top staff line (F5 in treble clef)
const STAFF_LEFT = 80;
const STAFF_RIGHT = SVG_W - 30;

// Staff lines y positions (top to bottom: F5, D5, B4, G4, E4)
const LINES_Y = [
  STAFF_TOP,
  STAFF_TOP + LINE_SPACING,
  STAFF_TOP + LINE_SPACING * 2,
  STAFF_TOP + LINE_SPACING * 3,
  STAFF_TOP + LINE_SPACING * 4,
];

/**
 * Convert staff position to Y coordinate
 * staffPosition 10 = top line F5  → LINES_Y[0]
 * staffPosition  9 = space E5     → LINES_Y[0] + LINE_SPACING/2
 * staffPosition  8 = 2nd line D5  → LINES_Y[1]
 * staffPosition  7 = space C5     → LINES_Y[1] + LINE_SPACING/2
 * staffPosition  6 = middle B4    → LINES_Y[2]
 * staffPosition  5 = space A4     → LINES_Y[2] + LINE_SPACING/2
 * staffPosition  4 = 4th line G4  → LINES_Y[3]
 * staffPosition  3 = space F4     → LINES_Y[3] + LINE_SPACING/2
 * staffPosition  2 = bottom E4    → LINES_Y[4]
 * staffPosition  1 = space D4     → LINES_Y[4] + LINE_SPACING/2
 * staffPosition  0 = ledger C4    → LINES_Y[4] + LINE_SPACING
 * staffPosition -1 = space B3     → LINES_Y[4] + LINE_SPACING*1.5
 * staffPosition -2 = ledger A3/Bb3→ LINES_Y[4] + LINE_SPACING*2
 * staffPosition -3 = space G#3/Ab3→ LINES_Y[4] + LINE_SPACING*2.5
 * staffPosition -4 = ledger G3    → LINES_Y[4] + LINE_SPACING*3
 */
function staffPosToY(pos: number): number {
  // Reference: pos 10 = LINES_Y[0]
  // Each step = LINE_SPACING / 2
  return LINES_Y[0] + (10 - pos) * (LINE_SPACING / 2);
}

// Note X position (center of staff)
const NOTE_X = STAFF_LEFT + (STAFF_RIGHT - STAFF_LEFT) * 0.58;

// Feedback colors
const NOTE_COLORS = {
  none: { fill: 'oklch(0.15 0.04 260)', stroke: 'oklch(0.15 0.04 260)' },
  correct: { fill: 'oklch(0.40 0.18 145)', stroke: 'oklch(0.30 0.18 145)' },
  incorrect: { fill: 'oklch(0.50 0.22 25)', stroke: 'oklch(0.40 0.22 25)' },
};

export default function MusicStaff({ note, feedback, showAnswer }: MusicStaffProps) {
  const noteY = note ? staffPosToY(note.staffPosition) : staffPosToY(5);
  const colors = NOTE_COLORS[feedback];

  // Ledger lines to draw
  const ledgerLines = note?.ledgerLines ?? [];

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
        style={{ maxHeight: '260px' }}
        aria-label={note ? `Nota ${note.displayName}${note.accidental ?? ''} no pentagrama` : 'Pentagrama'}
      >
        {/* Staff lines */}
        {LINES_Y.map((y, i) => (
          <line
            key={i}
            x1={STAFF_LEFT - 5}
            y1={y}
            x2={STAFF_RIGHT}
            y2={y}
            stroke="oklch(0.22 0.04 260)"
            strokeWidth={1.3}
            opacity={0.9}
          />
        ))}

        {/* Treble clef — Unicode music symbol rendered as text */}
        <text
          x={STAFF_LEFT - 62}
          y={LINES_Y[4] + 10}
          fontSize="82"
          fontFamily="'Noto Music', 'Segoe UI Symbol', serif"
          fill="oklch(0.22 0.04 260)"
          opacity={0.92}
        >
          𝄞
        </text>

        {/* Ledger lines */}
        {ledgerLines.map((pos) => {
          const ly = staffPosToY(pos);
          return (
            <line
              key={`ledger-${pos}`}
              x1={NOTE_X - 20}
              y1={ly}
              x2={NOTE_X + 20}
              y2={ly}
              stroke="oklch(0.22 0.04 260)"
              strokeWidth={1.3}
              opacity={0.9}
            />
          );
        })}

        {/* Animated note */}
        <AnimatePresence mode="wait">
          {note && (
            <motion.g
              key={note.id + feedback}
              initial={{ opacity: 0, y: noteY - 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* Accidental (sharp or flat) */}
              {note.accidental && (
                <text
                  x={NOTE_X - 24}
                  y={noteY + 6}
                  fontSize="19"
                  fontFamily="'Noto Music', serif"
                  fill={colors.fill}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {note.accidental === '#' ? '♯' : '♭'}
                </text>
              )}

              {/* Note head — whole note (open ellipse) */}
              <motion.ellipse
                cx={NOTE_X}
                cy={noteY}
                rx={10.5}
                ry={7.5}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={1.5}
                animate={{ fill: colors.fill, stroke: colors.stroke }}
                transition={{ duration: 0.18 }}
              />
              {/* Inner hole for whole note */}
              <ellipse
                cx={NOTE_X}
                cy={noteY}
                rx={4.5}
                ry={3}
                fill="oklch(0.99 0.008 85)"
                transform={`rotate(-22, ${NOTE_X}, ${noteY})`}
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Note name label below note when showAnswer */}
        <AnimatePresence>
          {showAnswer && note && (
            <motion.g
              key={`label-${note.id}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <rect
                x={NOTE_X - 36}
                y={noteY + 16}
                width={72}
                height={24}
                rx={6}
                fill={feedback === 'correct' ? 'oklch(0.40 0.18 145)' : feedback === 'incorrect' ? 'oklch(0.50 0.22 25)' : 'oklch(0.25 0.04 260)'}
                opacity={0.92}
              />
              <text
                x={NOTE_X}
                y={noteY + 31}
                fontSize="12"
                fontFamily="'DM Mono', monospace"
                fontWeight="500"
                fill="oklch(0.97 0.012 85)"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {note.displayName}{note.accidental === '#' ? '♯' : note.accidental === 'b' ? '♭' : ''}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Empty state hint */}
        {!note && (
          <text
            x={SVG_W / 2}
            y={LINES_Y[2]}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="13"
            fontFamily="'DM Sans', sans-serif"
            fill="oklch(0.70 0.02 85)"
            opacity={0.6}
          >
            Inicie o treino para ver as notas
          </text>
        )}
      </svg>
    </div>
  );
}
