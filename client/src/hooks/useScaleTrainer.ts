/**
 * useScaleTrainer.ts — Violin Note Trainer
 * State management for scale sequence training sessions.
 * Design: "Partitura Viva"
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomScale, getScaleNotes, type Scale } from '@/lib/musicData';

export interface ScaleSessionStats {
  total: number;
  correct: number;
  incorrect: number;
  completedScales: number;
  errorNotes: Record<string, number>;
  startTime: number;
}

const EMPTY_STATS: ScaleSessionStats = {
  total: 0,
  correct: 0,
  incorrect: 0,
  completedScales: 0,
  errorNotes: {},
  startTime: Date.now(),
};

export function useScaleTrainer() {
  const [currentScale, setCurrentScale] = useState<Scale | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [completedNoteIndices, setCompletedNoteIndices] = useState<number[]>([]);
  const [errorNoteIndices, setErrorNoteIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [sessionStats, setSessionStats] = useState<ScaleSessionStats>({ ...EMPTY_STATS });
  const [allTimeStats, setAllTimeStats] = useState<ScaleSessionStats>(() => {
    try {
      const saved = localStorage.getItem('vnt-scale-alltime');
      return saved ? JSON.parse(saved) : { ...EMPTY_STATS };
    } catch {
      return { ...EMPTY_STATS };
    }
  });

  const noteStartTimeRef = useRef<number>(Date.now());
  const isRunningRef = useRef(false);
  const currentScaleRef = useRef<Scale | null>(null);

  // Keep refs in sync
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { currentScaleRef.current = currentScale; }, [currentScale]);

  // Save all-time stats
  useEffect(() => {
    localStorage.setItem('vnt-scale-alltime', JSON.stringify(allTimeStats));
  }, [allTimeStats]);

  const advanceToNextNote = useCallback(() => {
    setCurrentNoteIndex(prev => {
      const scale = currentScaleRef.current;
      if (!scale) return 0;
      const notes = getScaleNotes(scale);
      if (prev >= notes.length - 1) {
        // Scale completed
        setCompletedNoteIndices([]);
        setErrorNoteIndices([]);
        setFeedback('none');
        const newScale = getRandomScale();
        setCurrentScale(newScale);
        return 0;
      }
      return prev + 1;
    });
    setFeedback('none');
    noteStartTimeRef.current = Date.now();
  }, []);

  const markNoteCorrect = useCallback(() => {
    if (feedback !== 'none') return;

    setFeedback('correct');
    setCompletedNoteIndices(prev => [...prev, currentNoteIndex]);

    setSessionStats(prev => ({
      ...prev,
      total: prev.total + 1,
      correct: prev.correct + 1,
    }));

    setAllTimeStats(prev => ({
      ...prev,
      total: prev.total + 1,
      correct: prev.correct + 1,
    }));

    setTimeout(() => {
      if (isRunningRef.current) {
        advanceToNextNote();
      }
    }, 300);
  }, [currentNoteIndex, feedback, advanceToNextNote]);

  const markNoteIncorrect = useCallback(() => {
    if (feedback !== 'none') return;

    setFeedback('incorrect');
    setErrorNoteIndices(prev => [...prev, currentNoteIndex]);

    const noteId = currentScale ? getScaleNotes(currentScale)[currentNoteIndex]?.id : '';

    setSessionStats(prev => ({
      ...prev,
      total: prev.total + 1,
      incorrect: prev.incorrect + 1,
      errorNotes: noteId
        ? { ...prev.errorNotes, [noteId]: (prev.errorNotes[noteId] ?? 0) + 1 }
        : prev.errorNotes,
    }));

    setAllTimeStats(prev => ({
      ...prev,
      total: prev.total + 1,
      incorrect: prev.incorrect + 1,
      errorNotes: noteId
        ? { ...prev.errorNotes, [noteId]: (prev.errorNotes[noteId] ?? 0) + 1 }
        : prev.errorNotes,
    }));

    setTimeout(() => {
      if (isRunningRef.current) {
        advanceToNextNote();
      }
    }, 450);
  }, [currentNoteIndex, currentScale, feedback, advanceToNextNote]);

  const startSession = useCallback(() => {
    const scale = getRandomScale();
    setCurrentScale(scale);
    setCurrentNoteIndex(0);
    setCompletedNoteIndices([]);
    setErrorNoteIndices([]);
    setFeedback('none');
    setSessionStats({ ...EMPTY_STATS, startTime: Date.now() });
    setIsRunning(true);
    isRunningRef.current = true;
    noteStartTimeRef.current = Date.now();
  }, []);

  const stopSession = useCallback(() => {
    setIsRunning(false);
    isRunningRef.current = false;
    setCurrentScale(null);
    setCurrentNoteIndex(0);
    setCompletedNoteIndices([]);
    setErrorNoteIndices([]);
    setFeedback('none');
  }, []);

  const resetAllTimeStats = useCallback(() => {
    const fresh = { ...EMPTY_STATS, startTime: Date.now() };
    setAllTimeStats(fresh);
    localStorage.setItem('vnt-scale-alltime', JSON.stringify(fresh));
  }, []);

  const accuracy = sessionStats.total > 0
    ? Math.round((sessionStats.correct / sessionStats.total) * 100)
    : 0;

  const scalesCompleted = completedNoteIndices.length > 0 && currentScale
    ? Math.floor((completedNoteIndices.length / getScaleNotes(currentScale).length))
    : 0;

  return {
    currentScale,
    currentNoteIndex,
    completedNoteIndices,
    errorNoteIndices,
    isRunning,
    feedback,
    sessionStats,
    allTimeStats,
    accuracy,
    scalesCompleted,
    startSession,
    stopSession,
    markNoteCorrect,
    markNoteIncorrect,
    resetAllTimeStats,
  };
}
