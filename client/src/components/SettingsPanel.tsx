/**
 * SettingsPanel.tsx — Violin Note Trainer
 * Settings drawer with all configuration options.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Eye, Volume2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import type { TrainerSettings } from '@/hooks/useTrainer';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TrainerSettings;
  onUpdateSettings: (updates: Partial<TrainerSettings>) => void;
  onResetStats: () => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetStats,
}: SettingsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-[oklch(0.99_0.008_85)] border-l border-[oklch(0.90_0.01_85)] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[oklch(0.90_0.01_85)]">
              <h2 className="text-lg font-bold text-[oklch(0.20_0.04_260)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Configurações
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[oklch(0.55_0.04_260)] hover:bg-[oklch(0.92_0.01_85)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              {/* Microphone */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Mic size={14} className="text-[oklch(0.45_0.04_260)]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.04_260)]">
                    Microfone
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[oklch(0.97_0.012_85)] rounded-xl p-3 border border-[oklch(0.90_0.01_85)]">
                  <div>
                    <div className="text-sm font-medium text-[oklch(0.25_0.04_260)]">Detecção de som</div>
                    <div className="text-xs text-[oklch(0.60_0.04_260)]">Detecta a nota que você toca</div>
                  </div>
                  <Switch
                    checked={settings.micEnabled}
                    onCheckedChange={(v) => onUpdateSettings({ micEnabled: v })}
                  />
                </div>
              </section>

              {/* Display */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Eye size={14} className="text-[oklch(0.45_0.04_260)]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.04_260)]">
                    Exibição
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[oklch(0.97_0.012_85)] rounded-xl p-3 border border-[oklch(0.90_0.01_85)]">
                  <div>
                    <div className="text-sm font-medium text-[oklch(0.25_0.04_260)]">Mostrar resposta</div>
                    <div className="text-xs text-[oklch(0.60_0.04_260)]">Exibe nome, corda e dedo</div>
                  </div>
                  <Switch
                    checked={settings.showAnswer}
                    onCheckedChange={(v) => onUpdateSettings({ showAnswer: v })}
                  />
                </div>
              </section>

              {/* Volume */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 size={14} className="text-[oklch(0.45_0.04_260)]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.04_260)]">
                    Áudio
                  </span>
                </div>
                <div className="bg-[oklch(0.97_0.012_85)] rounded-xl p-3 border border-[oklch(0.90_0.01_85)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-[oklch(0.25_0.04_260)]">Volume do feedback</div>
                    <span className="text-sm font-mono text-[oklch(0.45_0.04_260)]">
                      {Math.round(settings.feedbackVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[settings.feedbackVolume]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={([v]) => onUpdateSettings({ feedbackVolume: v })}
                    className="w-full"
                  />
                </div>
              </section>

              {/* Reset Stats */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <RotateCcw size={14} className="text-[oklch(0.45_0.04_260)]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.04_260)]">
                    Dados
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja apagar todo o histórico?')) {
                      onResetStats();
                    }
                  }}
                >
                  <RotateCcw size={14} className="mr-2" />
                  Apagar histórico
                </Button>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
