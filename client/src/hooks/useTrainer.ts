/**
 * useTrainer.ts — Violin Note Trainer
 * Core training session state management hook.
 * Fixed timer logic and note advancement.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomNote, type Note, type TrainingMode, type ViolinString } from '@/lib/musicData';

export type TimerMode = 3 | 5 | 7 | 10 | 'manual';
export type TrainingSessionMode = 'basic' | 'intermediate' | 'advanced' | 'challenge' | 'free';

export interface SessionStats {
  total: number;
  correct: number;
  incorrect: number;
  responseTimes: number[];
  errorNotes: Record<string, number>;
  startTime: number;
}

export interface TrainerSettings {
  timerMode: TimerMode;
  trainingMode: TrainingMode;
  stringFilter: ViolinString | 'all';
  showAnswer: boolean;
  micEnabled: boolean;
  feedbackVolume: number;
}

const DEFAULT_SETTINGS: TrainerSettings = {
  timerMode: 5,
  trainingMode: 'basic',
  stringFilter: 'all',
  showAnswer: true,
  micEnabled: false,
  feedbackVolume: 0.7,
};

const EMPTY_STATS: SessionStats = {
  total: 0,
  correct: 0,
  incorrect: 0,
  responseTimes: [],
  errorNotes: {},
  startTime: Date.now(),
};

export function useTrainer() {
  const [settings, setSettings] = useState<TrainerSettings>(() => {
    try {
      const saved = localStorage.getItem('vnt-settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [showAnswerOverlay, setShowAnswerOverlay] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({ ...EMPTY_STATS });
  const [allTimeStats, setAllTimeStats] = useState<SessionStats>(() => {
    try {
      const saved = localStorage.getItem('vnt-alltime');
      return saved ? JSON.parse(saved) : { ...EMPTY_STATS };
    } catch {
      return { ...EMPTY_STATS };
    }
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const noteStartTimeRef = useRef<number>(Date.now());
  const lastNoteIdRef = useRef<string | undefined>(undefined);
  const isRunningRef = useRef(false);
  const settingsRef = useRef(settings);
  const currentNoteRef = useRef<Note | null>(null);
  const feedbackRef = useRef<'none' | 'correct' | 'incorrect'>('none');

  // Keep refs in sync
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { currentNoteRef.current = currentNote; }, [currentNote]);
  useEffect(() => { feedbackRef.current = feedback; }, [feedback]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('vnt-settings', JSON.stringify(settings));
  }, [settings]);

  // Save all-time stats
  useEffect(() => {
    localStorage.setItem('vnt-alltime', JSON.stringify(allTimeStats));
  }, [allTimeStats]);

  const getTimerDuration = useCallback((s?: TrainerSettings): number => {
    const cfg = s ?? settingsRef.current;
    if (cfg.timerMode === 'manual') return 0;
    return cfg.timerMode as number;
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advanceNote = useCallback(() => {
    const cfg = settingsRef.current;
    const note = getRandomNote(cfg.trainingMode, cfg.stringFilter, lastNoteIdRef.current);
    lastNoteIdRef.current = note.id;
    setCurrentNote(note);
    setFeedback('none');
    feedbackRef.current = 'none';
    setShowAnswerOverlay(false);
    noteStartTimeRef.current = Date.now();

    if (cfg.timerMode !== 'manual') {
      const duration = getTimerDuration(cfg);
      setTimeLeft(duration);
    }
  }, [getTimerDuration]);

  // Start timer when note changes and session is running
  useEffect(() => {
    if (!isRunning || settings.timerMode === 'manual' || !currentNote) return;

    clearTimer();
    const duration = getTimerDuration();
    setTimeLeft(duration);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          // Time's up
          if (settingsRef.current.showAnswer) setShowAnswerOverlay(true);
          setTimeout(() => {
            if (isRunningRef.current) advanceNote();
          }, 1400);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNote?.id, isRunning]);

  const recordResult = useCallback((isCorrect: boolean) => {
    // Only record if microphone is enabled
    if (!settingsRef.current.micEnabled) return;
    
    const responseTime = Date.now() - noteStartTimeRef.current;
    const noteId = currentNoteRef.current?.id ?? '';

    setSessionStats(prev => ({
      ...prev,
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
      responseTimes: [...prev.responseTimes, responseTime],
      errorNotes: isCorrect
        ? prev.errorNotes
        : { ...prev.errorNotes, [noteId]: (prev.errorNotes[noteId] ?? 0) + 1 },
    }));

    setAllTimeStats(prev => ({
      ...prev,
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
      responseTimes: [...prev.responseTimes.slice(-200), responseTime],
      errorNotes: isCorrect
        ? prev.errorNotes
        : { ...prev.errorNotes, [noteId]: (prev.errorNotes[noteId] ?? 0) + 1 },
    }));
  }, []);

  const markCorrect = useCallback(() => {
    if (feedbackRef.current !== 'none') return;
    clearTimer();
    setFeedback('correct');
    feedbackRef.current = 'correct';
    recordResult(true);
    if (settingsRef.current.showAnswer) setShowAnswerOverlay(true);

    if (settingsRef.current.timerMode !== 'manual') {
      setTimeout(() => {
        if (isRunningRef.current) advanceNote();
      }, 450);
    }
  }, [clearTimer, recordResult, advanceNote]);

  const markIncorrect = useCallback(() => {
    if (feedbackRef.current !== 'none') return;
    clearTimer();
    setFeedback('incorrect');
    feedbackRef.current = 'incorrect';
    recordResult(false);
    if (settingsRef.current.showAnswer) setShowAnswerOverlay(true);

    if (settingsRef.current.timerMode !== 'manual') {
      setTimeout(() => {
        if (isRunningRef.current) advanceNote();
      }, 700);
    }
  }, [clearTimer, recordResult, advanceNote]);

  const startSession = useCallback(() => {
    setSessionStats({ ...EMPTY_STATS, startTime: Date.now() });
    setIsRunning(true);
    isRunningRef.current = true;
    advanceNote();
  }, [advanceNote]);

  const stopSession = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    isRunningRef.current = false;
    setCurrentNote(null);
    setFeedback('none');
    feedbackRef.current = 'none';
    setShowAnswerOverlay(false);
    setTimeLeft(0);
  }, [clearTimer]);

  const nextNote = useCallback(() => {
    if (!isRunningRef.current) return;
    advanceNote();
  }, [advanceNote]);

  const resetAllTimeStats = useCallback(() => {
    const fresh = { ...EMPTY_STATS, startTime: Date.now() };
    setAllTimeStats(fresh);
    localStorage.setItem('vnt-alltime', JSON.stringify(fresh));
  }, []);

  const updateSettings = useCallback((updates: Partial<TrainerSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const accuracy = sessionStats.total > 0
    ? Math.round((sessionStats.correct / sessionStats.total) * 100)
    : 0;

  const avgResponseTime = sessionStats.responseTimes.length > 0
    ? Math.round(sessionStats.responseTimes.reduce((a, b) => a + b, 0) / sessionStats.responseTimes.length / 100) / 10
    : 0;

  const timerProgress = settings.timerMode !== 'manual' && getTimerDuration() > 0
    ? timeLeft / getTimerDuration()
    : 1;

  return {
    currentNote,
    isRunning,
    feedback,
    showAnswerOverlay,
    timeLeft,
    timerProgress,
    sessionStats,
    allTimeStats,
    settings,
    accuracy,
    avgResponseTime,
    startSession,
    stopSession,
    nextNote,
    markCorrect,
    markIncorrect,
    updateSettings,
    resetAllTimeStats,
  };
}
