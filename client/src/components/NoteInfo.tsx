/**
 * NoteInfo.tsx — Violin Note Trainer
 * Shows note details: string, finger, frequency when answer is revealed.
 * Design: "Partitura Viva"
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { Note } from '@/lib/musicData';
import { STRING_COLORS, FINGER_NAMES } from '@/lib/musicData';

interface NoteInfoProps {
  note: Note | null;
  show: boolean;
  feedback: 'none' | 'correct' | 'incorrect';
}

export default function NoteInfo({ note, show, feedback }: NoteInfoProps) {
  if (!note) return null;

  const stringColor = STRING_COLORS[note.string];

  const bgClass = feedback === 'correct'
    ? 'bg-green-50/80 border-green-200'
    : feedback === 'incorrect'
    ? 'bg-red-50/80 border-red-200'
    : 'bg-[oklch(0.99_0.008_85)]/90 border-[oklch(0.90_0.01_85)]';

  const noteName = `${note.displayName}${note.accidental === '#' ? '♯' : note.accidental === 'b' ? '♭' : ''}`;
  const stringLabel = note.string === 'G' ? 'Sol' : note.string === 'D' ? 'Ré' : note.string === 'A' ? 'Lá' : 'Mi';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={`rounded-2xl border backdrop-blur-sm p-4 ${bgClass}`}
        >
          <div className="flex items-center gap-4">
            {/* Feedback badge */}
            {feedback !== 'none' && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
                  feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {feedback === 'correct' ? '✓' : '✗'}
              </motion.div>
            )}

            {/* Note name + octave */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-bold text-[oklch(0.18_0.04_260)]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {noteName}
                </span>
                <span className="text-sm text-[oklch(0.55_0.04_260)]">
                  oitava {note.octave}
                </span>
                <span className="text-xs font-mono text-[oklch(0.65_0.04_260)] ml-auto">
                  {note.frequency.toFixed(1)} Hz
                </span>
              </div>

              {/* String + Finger row */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stringColor }}
                  />
                  <span className="text-xs text-[oklch(0.45_0.04_260)]">Corda</span>
                  <span className="text-xs font-semibold text-[oklch(0.25_0.04_260)]">
                    {note.string} — {stringLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[oklch(0.25_0.04_260)] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {note.finger}
                  </span>
                  <span className="text-xs text-[oklch(0.45_0.04_260)]">
                    {FINGER_NAMES[note.finger]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
