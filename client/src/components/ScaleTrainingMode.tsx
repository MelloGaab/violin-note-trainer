/**
 * ScaleTrainingMode.tsx — Violin Note Trainer
 * Full scale training interface with sequence visualization and feedback.
 * Design: "Partitura Viva"
 */

import { motion } from 'framer-motion';
import { ArrowLeft, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScaleSequence from '@/components/ScaleSequence';
import { useScaleTrainer } from '@/hooks/useScaleTrainer';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { getScaleNotes } from '@/lib/musicData';

interface ScaleTrainingModeProps {
  onBack: () => void;
}

export default function ScaleTrainingMode({ onBack }: ScaleTrainingModeProps) {
  const trainer = useScaleTrainer();
  const audioFeedback = useAudioFeedback(0.7);

  const handleStart = () => {
    trainer.startSession();
  };

  const handleStop = () => {
    trainer.stopSession();
  };

  const handleCorrect = () => {
    audioFeedback.playCorrect();
    trainer.markNoteCorrect();
  };

  const handleIncorrect = () => {
    audioFeedback.playIncorrect();
    trainer.markNoteIncorrect();
  };

  if (!trainer.isRunning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.97_0.012_85)] to-[oklch(0.93_0.01_85)] p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[oklch(0.45_0.04_260)] hover:text-[oklch(0.25_0.04_260)] transition-colors"
            title="Voltar"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-semibold">Voltar</span>
          </button>
          <h1
            className="text-2xl font-bold text-[oklch(0.20_0.04_260)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Treino de Escalas
          </h1>
          <div className="w-20" />
        </div>

        {/* Welcome card */}
        <div className="max-w-2xl mx-auto flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-[oklch(0.90_0.01_85)]"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="text-5xl">🎼</div>
            </div>

            <h2
              className="text-3xl font-bold text-center mb-4 text-[oklch(0.20_0.04_260)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Treino de Escalas
            </h2>

            <p className="text-center text-[oklch(0.55_0.04_260)] mb-8 max-w-md mx-auto">
              Pratique sequências de escalas musicais para desenvolver padrões de dedilhado e fluência na leitura.
            </p>

            <div className="bg-[oklch(0.97_0.012_85)] rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-[oklch(0.25_0.04_260)] mb-4">Escalas disponíveis:</h3>
              <ul className="grid grid-cols-2 gap-3 text-sm text-[oklch(0.45_0.04_260)]">
                <li className="flex items-center gap-2">
                  <Music size={14} className="text-[oklch(0.65_0.18_60)]" />
                  Maiores (Dó, Sol, Ré, Lá)
                </li>
                <li className="flex items-center gap-2">
                  <Music size={14} className="text-[oklch(0.45_0.18_145)]" />
                  Menores Naturais
                </li>
                <li className="flex items-center gap-2">
                  <Music size={14} className="text-[oklch(0.40_0.08_260)]" />
                  Menores Harmônicas
                </li>
                <li className="flex items-center gap-2">
                  <Music size={14} className="text-[oklch(0.55_0.22_25)]" />
                  Pentatônicas
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleStart}
                className="flex-1 bg-[oklch(0.25_0.04_260)] hover:bg-[oklch(0.20_0.04_260)]"
              >
                Começar Treino
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Training session view
  const currentScale = trainer.currentScale;
  const notes = currentScale ? getScaleNotes(currentScale) : [];
  const currentNote = notes[trainer.currentNoteIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.97_0.012_85)] to-[oklch(0.93_0.01_85)] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[oklch(0.45_0.04_260)] hover:text-[oklch(0.25_0.04_260)] transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">Voltar</span>
        </button>
        <div className="text-center">
          <div className="text-sm font-mono text-[oklch(0.45_0.04_260)]">
            Precisão: {trainer.accuracy}%
          </div>
        </div>
        <div className="w-20" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Scale sequence visualization */}
        {currentScale && (
          <ScaleSequence
            scale={currentScale}
            currentNoteIndex={trainer.currentNoteIndex}
            completedNoteIndices={trainer.completedNoteIndices}
            errorNoteIndices={trainer.errorNoteIndices}
          />
        )}

        {/* Current note info */}
        {currentNote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-[oklch(0.90_0.01_85)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[oklch(0.60_0.04_260)] uppercase tracking-widest">Nota atual</p>
                <p
                  className="text-3xl font-bold text-[oklch(0.25_0.04_260)]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {currentNote.displayName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[oklch(0.60_0.04_260)] uppercase tracking-widest">Frequência</p>
                <p className="text-2xl font-mono text-[oklch(0.40_0.08_260)]">
                  {Math.round(currentNote.frequency)} Hz
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feedback message */}
        {trainer.feedback !== 'none' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl p-4 text-center font-semibold ${
              trainer.feedback === 'correct'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trainer.feedback === 'correct' ? '✓ Correto!' : '✗ Incorreto'}
          </motion.div>
        )}

        {/* Control buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleIncorrect}
            disabled={trainer.feedback !== 'none'}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            ✗ Errei
          </Button>
          <Button
            onClick={handleCorrect}
            disabled={trainer.feedback !== 'none'}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            ✓ Acertei
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center border border-[oklch(0.90_0.01_85)]">
            <p className="text-xs text-[oklch(0.60_0.04_260)] uppercase tracking-widest mb-1">Total</p>
            <p className="text-2xl font-bold text-[oklch(0.25_0.04_260)]">
              {trainer.sessionStats.total}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-[oklch(0.90_0.01_85)]">
            <p className="text-xs text-[oklch(0.60_0.04_260)] uppercase tracking-widest mb-1">Acertos</p>
            <p className="text-2xl font-bold text-green-600">
              {trainer.sessionStats.correct}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-[oklch(0.90_0.01_85)]">
            <p className="text-xs text-[oklch(0.60_0.04_260)] uppercase tracking-widest mb-1">Erros</p>
            <p className="text-2xl font-bold text-red-600">
              {trainer.sessionStats.incorrect}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
