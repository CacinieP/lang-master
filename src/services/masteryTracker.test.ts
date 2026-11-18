import { describe, expect, it } from 'vitest';
import {
  calculateMastery,
  isMastered,
  getConceptStatus,
  updateProgressAfterQuiz,
  calculateLayerProgress,
} from './masteryTracker';
import { defaultConceptProgress } from '@/types';
import type { ConceptProgress, Layer } from '@/types';

const LAYER: Layer = 'lexical';

function progressWith(overrides: Partial<ConceptProgress>): ConceptProgress {
  return { ...defaultConceptProgress(), ...overrides };
}

describe('mastery threshold', () => {
  it('calculateMastery returns the stored score', () => {
    expect(calculateMastery(progressWith({ mastery_score: 0.42 }))).toBe(0.42);
  });

  it('isMastered uses the 0.8 threshold inclusively', () => {
    expect(isMastered(progressWith({ mastery_score: 0.79 }))).toBe(false);
    expect(isMastered(progressWith({ mastery_score: 0.8 }))).toBe(true);
    expect(isMastered(progressWith({ mastery_score: 1 }))).toBe(true);
  });
});

describe('getConceptStatus', () => {
  it('maps undefined / fresh / attempted / mastered', () => {
    expect(getConceptStatus(undefined)).toBe('unvisited');
    expect(getConceptStatus(progressWith({}))).toBe('exploring');
    expect(getConceptStatus(progressWith({ attempts: 2, mastery_score: 0.3 }))).toBe('practicing');
    expect(getConceptStatus(progressWith({ attempts: 5, mastery_score: 0.9 }))).toBe('mastered');
  });
});

describe('updateProgressAfterQuiz', () => {
  it('passing adds 0.3 and increments attempts', () => {
    const next = updateProgressAfterQuiz(undefined, true, LAYER);
    expect(next.mastery_score).toBeCloseTo(0.3);
    expect(next.attempts).toBe(1);
    expect(next.status).toBe('practicing');
    expect(next.best_result).toBe('passed');
    expect(next.layer_progress.lexical).toBeCloseTo(0.2);
    expect(next.last_attempted_at).toBeGreaterThan(0);
  });

  it('failing subtracts 0.05 and keeps best_result', () => {
    const existing = progressWith({ mastery_score: 0.5, attempts: 3, best_result: 'passed' });
    const next = updateProgressAfterQuiz(existing, false, LAYER);
    expect(next.mastery_score).toBeCloseTo(0.45);
    expect(next.attempts).toBe(4);
    expect(next.best_result).toBe('passed');
    expect(next.layer_progress.lexical).toBe(0);
  });

  it('clamps the score into [0, 1]', () => {
    const low = updateProgressAfterQuiz(progressWith({ mastery_score: 0.02 }), false, LAYER);
    expect(low.mastery_score).toBe(0);
    const high = updateProgressAfterQuiz(progressWith({ mastery_score: 0.9 }), true, LAYER);
    expect(high.mastery_score).toBe(1);
  });

  it('marks mastered once the threshold is crossed', () => {
    const next = updateProgressAfterQuiz(progressWith({ mastery_score: 0.6, attempts: 2 }), true, LAYER);
    expect(next.mastery_score).toBeCloseTo(0.9);
    expect(next.status).toBe('mastered');
    expect(next.best_result).toBe('mastered');
  });

  it('caps layer_progress at 1', () => {
    const existing = progressWith({ layer_progress: { ...defaultConceptProgress().layer_progress, lexical: 0.95 } });
    const next = updateProgressAfterQuiz(existing, true, LAYER);
    expect(next.layer_progress.lexical).toBe(1);
  });

  it('does not mutate the existing progress object', () => {
    const existing = progressWith({ mastery_score: 0.3, attempts: 1 });
    const snapshot = JSON.stringify(existing);
    updateProgressAfterQuiz(existing, true, LAYER);
    expect(JSON.stringify(existing)).toBe(snapshot);
  });
});

describe('calculateLayerProgress', () => {
  const conceptLayers: Record<string, Layer> = { a: 'lexical', b: 'lexical', c: 'syntax' };
  const totals: Record<Layer, number> = { lexical: 2, morphological: 0, syntax: 1, semantic: 0, pragmatic: 0 };

  it('reports the mastered fraction per layer', () => {
    const all: Record<string, ConceptProgress> = {
      a: progressWith({ mastery_score: 0.9 }),
      b: progressWith({ mastery_score: 0.5 }),
      c: progressWith({ mastery_score: 0.8 }),
    };
    const result = calculateLayerProgress(all, conceptLayers, totals);
    expect(result.lexical).toBeCloseTo(0.5);
    expect(result.syntax).toBe(1);
  });

  it('returns 0 for layers with no concepts and ignores unknown ids', () => {
    const all: Record<string, ConceptProgress> = {
      ghost: progressWith({ mastery_score: 1 }),
    };
    const result = calculateLayerProgress(all, conceptLayers, totals);
    expect(result.morphological).toBe(0);
    expect(result.semantic).toBe(0);
    expect(result.pragmatic).toBe(0);
    expect(result.lexical).toBe(0);
  });
});
