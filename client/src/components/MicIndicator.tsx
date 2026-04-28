/**
 * MicIndicator.tsx — Violin Note Trainer
 * Shows microphone status and detected pitch.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MicIndicatorProps {
  isListening: boolean;
  isEnabled: boolean;
  detectedNote: string | null;
  detectedFrequency: number | null;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}

export default function MicIndicator({
  isListening,
  isEnabled,
  detectedNote,
  detectedFrequency,
  error,
  onStart,
  onStop,
}: MicIndicatorProps) {
  if (!isEnabled) return null;

  return (
    <div className="flex items-center gap-3 bg-[oklch(0.97_0.012_85)] rounded-xl px-4 py-2.5 border border-[oklch(0.90_0.01_85)]">
      {/* Mic button */}
      <button
        onClick={isListening ? onStop : onStart}
        className={`
          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
          ${isListening
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-[oklch(0.25_0.04_260)] text-white hover:bg-[oklch(0.20_0.04_260)]'
          }
        `}
      >
        {isListening ? <Mic size={14} /> : <MicOff size={14} />}
      </button>

      {/* Status */}
      <div className="flex-1 min-w-0">
        {error ? (
          <div className="text-xs text-red-500 truncate">{error}</div>
        ) : isListening ? (
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            <span className="text-xs text-[oklch(0.45_0.04_260)]">
              {detectedNote ? (
                <span className="font-semibold text-[oklch(0.25_0.04_260)]">
                  {detectedNote}
                  {detectedFrequency && (
                    <span className="font-normal text-[oklch(0.60_0.04_260)] ml-1">
                      {detectedFrequency} Hz
                    </span>
                  )}
                </span>
              ) : (
                'Ouvindo...'
              )}
            </span>
          </div>
        ) : (
          <span className="text-xs text-[oklch(0.60_0.04_260)]">
            Clique para ativar microfone
          </span>
        )}
      </div>
    </div>
  );
}
