/**
 * Home.tsx — Violin Note Trainer
 * Design: "Partitura Viva" — Music Manuscript + Modern Minimal
 *
 * Layout: Asymmetric 3-column on desktop, stacked on mobile
 * Left: Training controls (mode, string, timer)
 * Center: Staff + note display (hero)
 * Right: Progress & stats
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Mic, MicOff } from 'lucide-react';

import MusicStaff from '@/components/MusicStaff';
import TrainingControls from '@/components/TrainingControls';
import ProgressPanel from '@/components/ProgressPanel';
import NoteInfo from '@/components/NoteInfo';
import TimerRing from '@/components/TimerRing';
import SettingsPanel from '@/components/SettingsPanel';
import MicIndicator from '@/components/MicIndicator';
import ScaleTrainingMode from '@/components/ScaleTrainingMode';

import { useTrainer } from '@/hooks/useTrainer';
import { usePitchDetector } from '@/hooks/usePitchDetector';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663598685328/VWgo4fiS26vJVPar48baFh/violin-hero-HcChcKMLiPGHktoARhwT4P.webp';
const TEXTURE_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663598685328/VWgo4fiS26vJVPar48baFh/staff-texture-kHTJtdCXARJm2TJv2fWHng.webp';

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mobileTab, setMobileTab] = useState<'train' | 'stats'>('train');
  const [scaleMode, setScaleMode] = useState(false);

  const trainer = useTrainer();
  const pitchDetector = usePitchDetector(trainer.settings.micEnabled);
  const audio = useAudioFeedback(trainer.settings.feedbackVolume);

  const lastFeedbackRef = useRef<'none' | 'correct' | 'incorrect'>('none');

  // Play audio feedback when feedback changes
  useEffect(() => {
    if (trainer.feedback === lastFeedbackRef.current) return;
    lastFeedbackRef.current = trainer.feedback;
    if (trainer.feedback === 'correct') audio.playCorrect();
    if (trainer.feedback === 'incorrect') audio.playIncorrect();
  }, [trainer.feedback, audio]);

  // Auto-detect pitch and check note
  useEffect(() => {
    if (!trainer.isRunning || !trainer.settings.micEnabled || !pitchDetector.isListening) return;
    if (!trainer.currentNote || trainer.feedback !== 'none') return;

    const result = pitchDetector.checkNote(trainer.currentNote);
    if (result === 'correct') {
      trainer.markCorrect();
    } else if (result === 'incorrect') {
      trainer.markIncorrect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pitchDetector.detectedFrequency]);

  const handleStart = useCallback(() => {
    setShowWelcome(false);
    trainer.startSession();
    if (trainer.settings.micEnabled && !pitchDetector.isListening) {
      pitchDetector.startListening();
    }
  }, [trainer, pitchDetector]);

  const handleStop = useCallback(() => {
    trainer.stopSession();
    pitchDetector.stopListening();
  }, [trainer, pitchDetector]);

  const handleManualCorrect = useCallback(() => {
    if (!trainer.isRunning || trainer.feedback !== 'none') return;
    trainer.markCorrect();
  }, [trainer]);

  const handleManualIncorrect = useCallback(() => {
    if (!trainer.isRunning || trainer.feedback !== 'none') return;
    trainer.markIncorrect();
  }, [trainer]);

  const isManualTimer = String(trainer.settings.timerMode) === 'manual';

  // Scale mode view
  if (scaleMode) {
    return <ScaleTrainingMode onBack={() => setScaleMode(false)} />;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'oklch(0.97 0.012 85)',
        backgroundImage: `url(${TEXTURE_IMAGE})`,
        backgroundSize: '380px 380px',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'multiply',
      }}
    >
      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[oklch(0.88_0.01_85)] bg-[oklch(0.99_0.008_85)]/85 backdrop-blur-sm">
        <button
          onClick={() => {
            setShowWelcome(true);
            trainer.stopSession();
            pitchDetector.stopListening();
          }}
          className="flex items-center gap-3 hover:opacity-75 transition-opacity"
          title="Voltar à tela inicial"
        >
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.25_0.04_260)] flex items-center justify-center flex-shrink-0">
            <span className="text-[oklch(0.97_0.012_85)] text-xl leading-none" style={{ fontFamily: 'serif' }}>𝄞</span>
          </div>
          <div>
            <h1
              className="text-base font-bold text-[oklch(0.18_0.04_260)] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Violin Note Trainer
            </h1>
            <p className="text-xs text-[oklch(0.58_0.03_260)] hidden sm:block">Treino de leitura musical</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {trainer.settings.micEnabled && (
            <button
              onClick={() => pitchDetector.isListening ? pitchDetector.stopListening() : pitchDetector.startListening()}
              title={pitchDetector.isListening ? 'Desativar microfone' : 'Ativar microfone'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                pitchDetector.isListening
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-[oklch(0.92_0.01_85)] text-[oklch(0.45_0.04_260)] hover:bg-[oklch(0.88_0.01_85)]'
              }`}
            >
              {pitchDetector.isListening ? <Mic size={14} /> : <MicOff size={14} />}
            </button>
          )}

          <button
            onClick={() => setSettingsOpen(true)}
            title="Configurações"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[oklch(0.92_0.01_85)] text-[oklch(0.45_0.04_260)] hover:bg-[oklch(0.88_0.01_85)] transition-colors"
          >
            <Settings size={14} />
          </button>
        </div>
      </header>

      {/* ── Welcome Screen ── */}
      <AnimatePresence>
        {showWelcome && !trainer.isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-30 flex items-center justify-center"
            style={{
              backgroundImage: `url(${HERO_IMAGE})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-[oklch(0.97_0.012_85)]/80 backdrop-blur-[1px]" />
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              className="relative z-10 text-center max-w-sm px-6"
            >
              <div className="text-7xl mb-5 text-[oklch(0.22_0.04_260)]" style={{ fontFamily: 'serif', lineHeight: 1 }}>
                𝄞
              </div>
              <h2
                className="text-4xl font-bold text-[oklch(0.15_0.04_260)] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Violin Note Trainer
              </h2>
              <p className="text-[oklch(0.40_0.04_260)] mb-8 text-sm leading-relaxed">
                Aprenda a ler notas musicais no pentagrama e associe-as ao violino com treino diário interativo.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowWelcome(false)}
                  className="bg-[oklch(0.25_0.04_260)] hover:bg-[oklch(0.20_0.04_260)] text-[oklch(0.97_0.012_85)] h-12 text-sm font-semibold tracking-wide px-8 rounded-xl transition-all active:scale-95"
                >
                  Começar Treino
                </button>
                <button
                  onClick={() => { setShowWelcome(false); setScaleMode(true); }}
                  className="bg-[oklch(0.40_0.08_260)] hover:bg-[oklch(0.35_0.08_260)] text-[oklch(0.97_0.012_85)] h-12 text-sm font-semibold tracking-wide px-8 rounded-xl transition-all active:scale-95"
                >
                  Modo Escalas
                </button>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="text-sm text-[oklch(0.50_0.04_260)] hover:text-[oklch(0.28_0.04_260)] transition-colors"
                >
                  Configurações
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Layout ── */}
      <main className="relative z-10 px-3 sm:px-5 py-4 max-w-6xl mx-auto">

        {/* Mobile tab bar */}
        <div className="flex lg:hidden mb-4 bg-[oklch(0.92_0.01_85)] rounded-xl p-1 gap-1">
          {(['train', 'stats'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mobileTab === tab
                  ? 'bg-white text-[oklch(0.20_0.04_260)] shadow-sm'
                  : 'text-[oklch(0.55_0.04_260)]'
              }`}
            >
              {tab === 'train' ? '🎼 Treino' : '📊 Progresso'}
            </button>
          ))}
        </div>

        <div className="flex gap-4 lg:gap-5 items-start">

          {/* ── Left Panel — Training Controls (desktop) ── */}
          <aside className="w-[190px] flex-shrink-0 hidden lg:flex flex-col bg-[oklch(0.99_0.008_85)]/92 backdrop-blur-sm rounded-2xl border border-[oklch(0.90_0.01_85)] p-4 shadow-sm">
            <TrainingControls
              settings={trainer.settings}
              isRunning={trainer.isRunning}
              onStart={handleStart}
              onStop={handleStop}
              onNext={trainer.nextNote}
              onUpdateSettings={trainer.updateSettings}
            />
          </aside>

          {/* ── Mobile: Training tab ── */}
          {mobileTab === 'train' && (
            <div className="flex lg:hidden flex-col gap-3 w-full">
              <div className="bg-[oklch(0.99_0.008_85)]/92 backdrop-blur-sm rounded-2xl border border-[oklch(0.90_0.01_85)] p-4 shadow-sm">
                <TrainingControls
                  settings={trainer.settings}
                  isRunning={trainer.isRunning}
                  onStart={handleStart}
                  onStop={handleStop}
                  onNext={trainer.nextNote}
                  onUpdateSettings={trainer.updateSettings}
                />
              </div>
              <StaffArea
                trainer={trainer}
                pitchDetector={pitchDetector}
                isManualTimer={isManualTimer}
                handleManualCorrect={handleManualCorrect}
                handleManualIncorrect={handleManualIncorrect}
              />
            </div>
          )}

          {/* ── Mobile: Stats tab ── */}
          {mobileTab === 'stats' && (
            <div className="flex lg:hidden w-full bg-[oklch(0.99_0.008_85)]/92 backdrop-blur-sm rounded-2xl border border-[oklch(0.90_0.01_85)] p-4 shadow-sm min-h-[400px]">
              <ProgressPanel
                sessionStats={trainer.sessionStats}
                allTimeStats={trainer.allTimeStats}
                isRunning={trainer.isRunning}
              />
            </div>
          )}

          {/* ── Desktop: Center Staff ── */}
          <div className="hidden lg:flex flex-1 flex-col gap-3 min-w-0">
            <StaffArea
              trainer={trainer}
              pitchDetector={pitchDetector}
              isManualTimer={isManualTimer}
              handleManualCorrect={handleManualCorrect}
              handleManualIncorrect={handleManualIncorrect}
            />
          </div>

          {/* ── Right Panel — Progress (desktop) ── */}
          <aside className="w-[200px] flex-shrink-0 hidden lg:flex flex-col bg-[oklch(0.99_0.008_85)]/92 backdrop-blur-sm rounded-2xl border border-[oklch(0.90_0.01_85)] p-4 shadow-sm">
            <ProgressPanel
              sessionStats={trainer.sessionStats}
              allTimeStats={trainer.allTimeStats}
              isRunning={trainer.isRunning}
            />
          </aside>
        </div>
      </main>

      {/* ── Settings Drawer ── */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={trainer.settings}
        onUpdateSettings={trainer.updateSettings}
        onResetStats={trainer.resetAllTimeStats}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Staff Area sub-component
// ─────────────────────────────────────────────
interface StaffAreaProps {
  trainer: ReturnType<typeof useTrainer>;
  pitchDetector: ReturnType<typeof usePitchDetector>;
  isManualTimer: boolean;
  handleManualCorrect: () => void;
  handleManualIncorrect: () => void;
}

function StaffArea({ trainer, pitchDetector, isManualTimer, handleManualCorrect, handleManualIncorrect }: StaffAreaProps) {
  return (
    <>
      {/* Staff card */}
      <div className="bg-[oklch(0.99_0.008_85)]/92 backdrop-blur-sm rounded-2xl border border-[oklch(0.90_0.01_85)] p-4 sm:p-5 shadow-sm relative overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.04_260)]">
            Clave de Sol
          </span>
          <div className="flex items-center gap-3">
            {trainer.isRunning && trainer.sessionStats.total > 0 && (
              <span className="text-xs font-mono text-[oklch(0.55_0.04_260)]">
                {trainer.accuracy}% precisão · {trainer.sessionStats.total} notas
              </span>
            )}
            {trainer.isRunning && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium"
              >
                ● Ativo
              </motion.span>
            )}
          </div>
        </div>

        {/* Staff SVG */}
        <div className="relative">
          <MusicStaff
            note={trainer.currentNote}
            feedback={trainer.feedback}
            showAnswer={trainer.showAnswerOverlay}
          />

          {/* Timer ring — positioned top-right of staff area */}
          {trainer.isRunning && !isManualTimer && (
            <div className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 pointer-events-none">
              <TimerRing
                progress={trainer.timerProgress}
                timeLeft={trainer.timeLeft}
                isRunning={trainer.isRunning}
                isManual={isManualTimer}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mic indicator */}
      {trainer.settings.micEnabled && (
        <MicIndicator
          isListening={pitchDetector.isListening}
          isEnabled={trainer.settings.micEnabled}
          detectedNote={pitchDetector.detectedNote}
          detectedFrequency={pitchDetector.detectedFrequency}
          error={pitchDetector.error}
          onStart={pitchDetector.startListening}
          onStop={pitchDetector.stopListening}
        />
      )}

      {/* Note info panel */}
      <NoteInfo
        note={trainer.currentNote}
        show={trainer.showAnswerOverlay}
        feedback={trainer.feedback}
      />

      {/* Manual feedback buttons (no mic mode) */}
      <AnimatePresence>
        {trainer.isRunning && !trainer.settings.micEnabled && trainer.currentNote && trainer.feedback === 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              onClick={handleManualCorrect}
              className="py-3.5 rounded-xl bg-[oklch(0.45_0.18_145)] hover:bg-[oklch(0.38_0.18_145)] text-white font-semibold text-sm transition-all active:scale-95 shadow-sm"
            >
              ✓ Acertei
            </button>
            <button
              onClick={handleManualIncorrect}
              className="py-3.5 rounded-xl bg-[oklch(0.55_0.22_25)] hover:bg-[oklch(0.48_0.22_25)] text-white font-semibold text-sm transition-all active:scale-95 shadow-sm"
            >
              ✗ Errei
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next note button after feedback (manual timer) */}
      <AnimatePresence>
        {trainer.isRunning && trainer.feedback !== 'none' && isManualTimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <button
              onClick={trainer.nextNote}
              className="text-sm text-[oklch(0.40_0.04_260)] hover:text-[oklch(0.22_0.04_260)] transition-colors font-medium underline underline-offset-2"
            >
              Próxima nota →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start prompt when not running */}
      {!trainer.isRunning && (
        <div className="text-center">
          <button
            onClick={() => {
              trainer.startSession();
            }}
            className="bg-[oklch(0.25_0.04_260)] hover:bg-[oklch(0.20_0.04_260)] text-[oklch(0.97_0.012_85)] h-11 px-8 rounded-xl text-sm font-semibold tracking-wide transition-all active:scale-95 shadow-sm"
          >
            Iniciar Treino
          </button>
        </div>
      )}
    </>
  );
}
