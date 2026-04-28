/**
 * usePitchDetector.ts — Violin Note Trainer
 * Pitch detection via Web Audio API using autocorrelation (YIN-like algorithm).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Note } from '@/lib/musicData';

interface PitchDetectorResult {
  detectedFrequency: number | null;
  detectedNote: string | null;
  isListening: boolean;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  checkNote: (targetNote: Note) => 'correct' | 'incorrect' | 'none';
}

// Autocorrelation-based pitch detection
function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  const MIN_FREQ = 180; // G3 is ~196 Hz, give some margin
  const MAX_FREQ = 950; // A5 is ~880 Hz

  let bestOffset = -1;
  let bestCorrelation = 0;
  let rms = 0;

  // Calculate RMS to check if there's enough signal
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);

  if (rms < 0.01) return null; // Too quiet

  let lastCorrelation = 1;
  let foundGoodCorrelation = false;

  for (let offset = Math.floor(sampleRate / MAX_FREQ); offset < Math.floor(sampleRate / MIN_FREQ); offset++) {
    let correlation = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;

    if (correlation > 0.9 && correlation > lastCorrelation) {
      foundGoodCorrelation = true;
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    } else if (foundGoodCorrelation) {
      break;
    }
    lastCorrelation = correlation;
  }

  if (bestOffset === -1 || bestCorrelation < 0.9) return null;

  return sampleRate / bestOffset;
}

// Convert frequency to note name
function freqToNoteName(freq: number): string {
  const A4 = 440;
  const semitones = Math.round(12 * Math.log2(freq / A4));
  const noteNames = ['Lá', 'Sib', 'Si', 'Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#'];
  const index = ((semitones % 12) + 12) % 12;
  return noteNames[index];
}

export function usePitchDetector(enabled: boolean): PitchDetectorResult {
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [detectedNote, setDetectedNote] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const bufferRef = useRef<Float32Array | null>(null);

  const stopListening = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    setIsListening(false);
    setDetectedFrequency(null);
    setDetectedNote(null);
  }, []);

  const startListening = useCallback(async () => {
    if (!enabled) return;
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      bufferRef.current = new Float32Array(analyser.fftSize);
      setIsListening(true);

      const detect = () => {
        if (!analyserRef.current || !bufferRef.current) return;
        analyserRef.current.getFloatTimeDomainData(bufferRef.current);
        const freq = detectPitch(bufferRef.current, audioContext.sampleRate);

        if (freq !== null) {
          setDetectedFrequency(Math.round(freq * 10) / 10);
          setDetectedNote(freqToNoteName(freq));
        }

        animFrameRef.current = requestAnimationFrame(detect);
      };

      detect();
    } catch (err) {
      setError('Não foi possível acessar o microfone. Verifique as permissões.');
      setIsListening(false);
    }
  }, [enabled]);

  // Auto-stop when disabled
  useEffect(() => {
    if (!enabled && isListening) {
      stopListening();
    }
  }, [enabled, isListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  const checkNote = useCallback((targetNote: Note): 'correct' | 'incorrect' | 'none' => {
    if (!detectedFrequency) return 'none';

    // Allow ±50 cents tolerance
    const ratio = detectedFrequency / targetNote.frequency;
    const cents = Math.abs(1200 * Math.log2(ratio));

    if (cents <= 50) return 'correct';
    if (cents <= 150) return 'incorrect';
    return 'none';
  }, [detectedFrequency]);

  return {
    detectedFrequency,
    detectedNote,
    isListening,
    error,
    startListening,
    stopListening,
    checkNote,
  };
}
