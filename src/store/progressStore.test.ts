import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useProgressStore } from './progressStore';
import { defaultConceptProgress } from '@/types';
import type { Layer } from '@/types';

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, String(v));
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => store.clear(),
  };
}

const conceptLayers: Record<string, Layer> = { alpha: 'lexical', beta: 'lexical' };
const totals: Record<Layer, number> = { lexical: 2, morphological: 0, syntax: 0, semantic: 0, pragmatic: 0 };

beforeEach(() => {
  vi.stubGlobal('localStorage', createLocalStorageMock());
  useProgressStore.setState({
    conceptProgress: {},
    layerProgress: { lexical: 0, morphological: 0, syntax: 0, semantic: 0, pragmatic: 0 },
    conceptLayers: {},
    totalPerLayer: { lexical: 0, morphological: 0, syntax: 0, semantic: 0, pragmatic: 0 },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('progressStore', () => {
  it('load reads persisted progress and computes layer fractions', () => {
    localStorage.setItem(
      'langmaster_progress',
      JSON.stringify({ alpha: { ...defaultConceptProgress(), mastery_score: 0.9 } }),
    );
    useProgressStore.getState().load(conceptLayers, totals);
    expect(useProgressStore.getState().getMasteryScore('alpha')).toBe(0.9);
    expect(useProgressStore.getState().layerProgress.lexical).toBeCloseTo(0.5);
  });

  it('recordQuizResult updates mastery, status and persistence', () => {
    useProgressStore.getState().load(conceptLayers, totals);
    useProgressStore.getState().recordQuizResult('alpha', 'lexical', true);
    const s = useProgressStore.getState();
    expect(s.getMasteryScore('alpha')).toBeCloseTo(0.3);
    expect(s.getConceptStatus('alpha')).toBe('practicing');
    const persisted = JSON.parse(localStorage.getItem('langmaster_progress')!);
    expect(persisted.alpha.attempts).toBe(1);
  });

  it('tracks mastered concepts across repeated passes', () => {
    useProgressStore.getState().load(conceptLayers, totals);
    for (let i = 0; i < 3; i++) useProgressStore.getState().recordQuizResult('alpha', 'lexical', true);
    const s = useProgressStore.getState();
    expect(s.getConceptStatus('alpha')).toBe('mastered');
    expect([...s.getMasteredConceptIds()]).toEqual(['alpha']);
    expect(s.layerProgress.lexical).toBeCloseTo(0.5);
  });

  it('unknown concepts read as unvisited with zero mastery', () => {
    expect(useProgressStore.getState().getConceptStatus('ghost')).toBe('unvisited');
    expect(useProgressStore.getState().getMasteryScore('ghost')).toBe(0);
  });
});
