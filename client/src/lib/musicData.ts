/**
 * musicData.ts — Violin Note Trainer
 * Design: "Partitura Viva" — Music Manuscript + Modern Minimal
 * All note definitions, staff positions, and violin fingering data.
 */

export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = '#' | 'b' | null;
export type ViolinString = 'G' | 'D' | 'A' | 'E';
export type TrainingMode = 'basic' | 'intermediate' | 'advanced';

export interface Note {
  id: string;
  name: NoteName;
  accidental: Accidental;
  octave: number;
  /** Staff position: 0 = first ledger line below staff (middle C area), positive = up */
  staffPosition: number;
  /** Which violin string this note is played on */
  string: ViolinString;
  /** Finger number: 0 = open string, 1-4 = fingers */
  finger: number;
  /** Display name in Portuguese */
  displayName: string;
  /** Frequency in Hz */
  frequency: number;
  /** Whether this note requires ledger lines */
  ledgerLines: number[];
}

/**
 * Staff position reference (treble clef):
 * Position 0 = space below first line (D4 area, but we use it as reference)
 * Each step = half a line spacing
 * Lines are at positions: 2, 4, 6, 8, 10 (E4, G4, B4, D5, F5)
 * Spaces are at positions: 1, 3, 5, 7, 9 (D4, F4, A4, C5, E5)
 * Ledger line below: position -2 = C4 (middle C), -4 = A3
 * Ledger line above: position 12 = A5
 *
 * We define position relative to the staff:
 * staffPosition 0 = first ledger line below (C4 / middle C)
 * staffPosition 1 = space below first line (D4)
 * staffPosition 2 = first line (E4)
 * staffPosition 3 = first space (F4)
 * staffPosition 4 = second line (G4)
 * staffPosition 5 = second space (A4)
 * staffPosition 6 = third line (B4)
 * staffPosition 7 = third space (C5)
 * staffPosition 8 = fourth line (D5)
 * staffPosition 9 = fourth space (E5)
 * staffPosition 10 = fifth line (F5)
 * staffPosition 11 = above fifth line (G5)
 * staffPosition 12 = first ledger line above (A5)
 * staffPosition -2 = second ledger line below (A3) -- for G string
 * staffPosition -4 = third ledger line below (G3) -- open G string
 */

// Ledger lines needed for each staff position
function getLedgerLines(pos: number): number[] {
  const lines: number[] = [];
  if (pos <= -2) {
    for (let i = -2; i >= pos; i -= 2) lines.push(i);
  }
  if (pos === 0) lines.push(0);
  if (pos >= 12) {
    for (let i = 12; i <= pos; i += 2) lines.push(i);
  }
  return lines;
}

// All notes available in the violin range (G3 to A5 + extensions)
export const ALL_NOTES: Note[] = [
  // G string (open G3 to C#4)
  { id: 'G3', name: 'G', accidental: null, octave: 3, staffPosition: -4, string: 'G', finger: 0, displayName: 'Sol', frequency: 196.00, ledgerLines: getLedgerLines(-4) },
  { id: 'Ab3', name: 'A', accidental: 'b', octave: 3, staffPosition: -3, string: 'G', finger: 1, displayName: 'Láb', frequency: 207.65, ledgerLines: getLedgerLines(-3) },
  { id: 'A3', name: 'A', accidental: null, octave: 3, staffPosition: -3, string: 'G', finger: 1, displayName: 'Lá', frequency: 220.00, ledgerLines: getLedgerLines(-3) },
  { id: 'Bb3', name: 'B', accidental: 'b', octave: 3, staffPosition: -2, string: 'G', finger: 2, displayName: 'Sib', frequency: 233.08, ledgerLines: getLedgerLines(-2) },
  { id: 'B3', name: 'B', accidental: null, octave: 3, staffPosition: -2, string: 'G', finger: 2, displayName: 'Si', frequency: 246.94, ledgerLines: getLedgerLines(-2) },
  { id: 'C4', name: 'C', accidental: null, octave: 4, staffPosition: 0, string: 'G', finger: 3, displayName: 'Dó', frequency: 261.63, ledgerLines: getLedgerLines(0) },
  { id: 'C#4', name: 'C', accidental: '#', octave: 4, staffPosition: 0, string: 'G', finger: 3, displayName: 'Dó#', frequency: 277.18, ledgerLines: getLedgerLines(0) },

  // D string (open D4 to G#4)
  { id: 'D4', name: 'D', accidental: null, octave: 4, staffPosition: 1, string: 'D', finger: 0, displayName: 'Ré', frequency: 293.66, ledgerLines: getLedgerLines(1) },
  { id: 'Eb4', name: 'E', accidental: 'b', octave: 4, staffPosition: 2, string: 'D', finger: 1, displayName: 'Mib', frequency: 311.13, ledgerLines: getLedgerLines(2) },
  { id: 'E4', name: 'E', accidental: null, octave: 4, staffPosition: 2, string: 'D', finger: 1, displayName: 'Mi', frequency: 329.63, ledgerLines: getLedgerLines(2) },
  { id: 'F4', name: 'F', accidental: null, octave: 4, staffPosition: 3, string: 'D', finger: 2, displayName: 'Fá', frequency: 349.23, ledgerLines: getLedgerLines(3) },
  { id: 'F#4', name: 'F', accidental: '#', octave: 4, staffPosition: 3, string: 'D', finger: 2, displayName: 'Fá#', frequency: 369.99, ledgerLines: getLedgerLines(3) },
  { id: 'G4', name: 'G', accidental: null, octave: 4, staffPosition: 4, string: 'D', finger: 3, displayName: 'Sol', frequency: 392.00, ledgerLines: getLedgerLines(4) },
  { id: 'G#4', name: 'G', accidental: '#', octave: 4, staffPosition: 4, string: 'D', finger: 3, displayName: 'Sol#', frequency: 415.30, ledgerLines: getLedgerLines(4) },

  // A string (open A4 to D#5)
  { id: 'A4', name: 'A', accidental: null, octave: 4, staffPosition: 5, string: 'A', finger: 0, displayName: 'Lá', frequency: 440.00, ledgerLines: getLedgerLines(5) },
  { id: 'Bb4', name: 'B', accidental: 'b', octave: 4, staffPosition: 6, string: 'A', finger: 1, displayName: 'Sib', frequency: 466.16, ledgerLines: getLedgerLines(6) },
  { id: 'B4', name: 'B', accidental: null, octave: 4, staffPosition: 6, string: 'A', finger: 1, displayName: 'Si', frequency: 493.88, ledgerLines: getLedgerLines(6) },
  { id: 'C5', name: 'C', accidental: null, octave: 5, staffPosition: 7, string: 'A', finger: 2, displayName: 'Dó', frequency: 523.25, ledgerLines: getLedgerLines(7) },
  { id: 'C#5', name: 'C', accidental: '#', octave: 5, staffPosition: 7, string: 'A', finger: 2, displayName: 'Dó#', frequency: 554.37, ledgerLines: getLedgerLines(7) },
  { id: 'D5', name: 'D', accidental: null, octave: 5, staffPosition: 8, string: 'A', finger: 3, displayName: 'Ré', frequency: 587.33, ledgerLines: getLedgerLines(8) },
  { id: 'D#5', name: 'D', accidental: '#', octave: 5, staffPosition: 8, string: 'A', finger: 3, displayName: 'Ré#', frequency: 622.25, ledgerLines: getLedgerLines(8) },

  // E string (open E5 to A5)
  { id: 'E5', name: 'E', accidental: null, octave: 5, staffPosition: 9, string: 'E', finger: 0, displayName: 'Mi', frequency: 659.25, ledgerLines: getLedgerLines(9) },
  { id: 'F5', name: 'F', accidental: null, octave: 5, staffPosition: 10, string: 'E', finger: 1, displayName: 'Fá', frequency: 698.46, ledgerLines: getLedgerLines(10) },
  { id: 'F#5', name: 'F', accidental: '#', octave: 5, staffPosition: 10, string: 'E', finger: 1, displayName: 'Fá#', frequency: 739.99, ledgerLines: getLedgerLines(10) },
  { id: 'G5', name: 'G', accidental: null, octave: 5, staffPosition: 11, string: 'E', finger: 2, displayName: 'Sol', frequency: 783.99, ledgerLines: getLedgerLines(11) },
  { id: 'G#5', name: 'G', accidental: '#', octave: 5, staffPosition: 11, string: 'E', finger: 2, displayName: 'Sol#', frequency: 830.61, ledgerLines: getLedgerLines(11) },
  { id: 'A5', name: 'A', accidental: null, octave: 5, staffPosition: 12, string: 'E', finger: 3, displayName: 'Lá', frequency: 880.00, ledgerLines: getLedgerLines(12) },
];

/** Filter notes by training mode */
export function getNotesByMode(mode: TrainingMode, stringFilter: ViolinString | 'all'): Note[] {
  let notes = ALL_NOTES;

  // Filter by string
  if (stringFilter !== 'all') {
    notes = notes.filter(n => n.string === stringFilter);
  }

  // Filter by mode
  switch (mode) {
    case 'basic':
      // Only natural notes (no accidentals)
      notes = notes.filter(n => n.accidental === null);
      break;
    case 'intermediate':
      // All notes including accidentals
      break;
    case 'advanced':
      // All notes (same as intermediate for now, but could add more positions)
      break;
  }

  return notes;
}

/** Get a random note from the available set, avoiding repeating the last note */
export function getRandomNote(
  mode: TrainingMode,
  stringFilter: ViolinString | 'all',
  lastNoteId?: string
): Note {
  const notes = getNotesByMode(mode, stringFilter);
  const available = notes.filter(n => n.id !== lastNoteId);
  const pool = available.length > 0 ? available : notes;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** String display names */
export const STRING_NAMES: Record<ViolinString | 'all', string> = {
  all: 'Todas as cordas',
  G: 'Corda Sol (G)',
  D: 'Corda Ré (D)',
  A: 'Corda Lá (A)',
  E: 'Corda Mi (E)',
};

/** String colors for visual distinction */
export const STRING_COLORS: Record<ViolinString, string> = {
  G: '#8B4513',
  D: '#C0A060',
  A: '#708090',
  E: '#C0C0C0',
};

/** Finger display names */
export const FINGER_NAMES: Record<number, string> = {
  0: 'Corda solta',
  1: '1º dedo',
  2: '2º dedo',
  3: '3º dedo',
  4: '4º dedo',
};


/**
 * SCALE TRAINING MODE
 * Sequences of notes for practicing fingering patterns and scale technique
 */

export type ScaleType = 'major' | 'minor_natural' | 'minor_harmonic' | 'pentatonic_major' | 'pentatonic_minor' | 'chromatic';

export interface Scale {
  id: string;
  name: string;
  root: NoteName;
  type: ScaleType;
  /** Sequence of note IDs that form the scale */
  noteIds: string[];
  /** Display name in Portuguese */
  displayName: string;
  /** Description of the scale pattern */
  description: string;
}

/**
 * Helper: Get note by ID
 */
function getNoteById(id: string): Note | undefined {
  return ALL_NOTES.find(n => n.id === id);
}

/**
 * Build a scale sequence starting from a root note
 * Pattern: intervals in semitones (0 = root, 2 = major second, etc.)
 */
function buildScale(rootId: string, intervals: number[]): string[] {
  const rootNote = getNoteById(rootId);
  if (!rootNote) return [];

  const result: string[] = [];
  let currentOctave = rootNote.octave;
  let currentIndex = ALL_NOTES.findIndex(n => n.id === rootId);

  for (const interval of intervals) {
    let targetIndex = currentIndex + interval;
    let targetOctave = currentOctave;

    // Handle octave wrapping
    while (targetIndex >= ALL_NOTES.length) {
      targetIndex -= 12;
      targetOctave += 1;
    }
    while (targetIndex < 0) {
      targetIndex += 12;
      targetOctave -= 1;
    }

    const targetNote = ALL_NOTES[targetIndex];
    if (targetNote && targetNote.octave === targetOctave) {
      result.push(targetNote.id);
    }
  }

  return result;
}

// Scale patterns (intervals in semitones from root)
const SCALE_PATTERNS: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  minor_natural: [0, 2, 3, 5, 7, 8, 10, 12],
  minor_harmonic: [0, 2, 3, 5, 7, 8, 11, 12],
  pentatonic_major: [0, 2, 4, 7, 9, 12],
  pentatonic_minor: [0, 3, 5, 7, 10, 12],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

// Available scales for training
export const AVAILABLE_SCALES: Scale[] = [
  // Major scales
  {
    id: 'C_major',
    name: 'C',
    root: 'C',
    type: 'major',
    noteIds: buildScale('C4', SCALE_PATTERNS.major),
    displayName: 'Dó Maior',
    description: 'Escala maior sem sustenidos ou bemóis',
  },
  {
    id: 'G_major',
    name: 'G',
    root: 'G',
    type: 'major',
    noteIds: buildScale('G3', SCALE_PATTERNS.major),
    displayName: 'Sol Maior',
    description: 'Escala maior com 1 sustenido (Fá#)',
  },
  {
    id: 'D_major',
    name: 'D',
    root: 'D',
    type: 'major',
    noteIds: buildScale('D4', SCALE_PATTERNS.major),
    displayName: 'Ré Maior',
    description: 'Escala maior com 2 sustenidos (Fá#, Dó#)',
  },
  {
    id: 'A_major',
    name: 'A',
    root: 'A',
    type: 'major',
    noteIds: buildScale('A4', SCALE_PATTERNS.major),
    displayName: 'Lá Maior',
    description: 'Escala maior com 3 sustenidos (Fá#, Dó#, Sol#)',
  },

  // Natural minor scales
  {
    id: 'A_minor',
    name: 'A',
    root: 'A',
    type: 'minor_natural',
    noteIds: buildScale('A3', SCALE_PATTERNS.minor_natural),
    displayName: 'Lá Menor Natural',
    description: 'Escala menor relativa a Dó Maior',
  },
  {
    id: 'E_minor',
    name: 'E',
    root: 'E',
    type: 'minor_natural',
    noteIds: buildScale('E4', SCALE_PATTERNS.minor_natural),
    displayName: 'Mi Menor Natural',
    description: 'Escala menor com 1 sustenido (Fá#)',
  },
  {
    id: 'D_minor',
    name: 'D',
    root: 'D',
    type: 'minor_natural',
    noteIds: buildScale('D4', SCALE_PATTERNS.minor_natural),
    displayName: 'Ré Menor Natural',
    description: 'Escala menor com 1 bemol (Sib)',
  },

  // Harmonic minor scales
  {
    id: 'A_harmonic_minor',
    name: 'A',
    root: 'A',
    type: 'minor_harmonic',
    noteIds: buildScale('A3', SCALE_PATTERNS.minor_harmonic),
    displayName: 'Lá Menor Harmônica',
    description: 'Menor natural com 7º grau elevado (Sol#)',
  },

  // Pentatonic scales
  {
    id: 'C_pentatonic_major',
    name: 'C',
    root: 'C',
    type: 'pentatonic_major',
    noteIds: buildScale('C4', SCALE_PATTERNS.pentatonic_major),
    displayName: 'Dó Pentatônica Maior',
    description: 'Escala pentatônica: Dó, Ré, Mi, Sol, Lá',
  },
  {
    id: 'A_pentatonic_minor',
    name: 'A',
    root: 'A',
    type: 'pentatonic_minor',
    noteIds: buildScale('A3', SCALE_PATTERNS.pentatonic_minor),
    displayName: 'Lá Pentatônica Menor',
    description: 'Escala pentatônica: Lá, Dó, Ré, Mi, Sol',
  },
];

/**
 * Get a random scale from the available set
 */
export function getRandomScale(): Scale {
  return AVAILABLE_SCALES[Math.floor(Math.random() * AVAILABLE_SCALES.length)];
}

/**
 * Get scale by ID
 */
export function getScaleById(id: string): Scale | undefined {
  return AVAILABLE_SCALES.find(s => s.id === id);
}

/**
 * Get all notes from a scale
 */
export function getScaleNotes(scale: Scale): Note[] {
  return scale.noteIds
    .map(id => getNoteById(id))
    .filter((n): n is Note => n !== undefined);
}
