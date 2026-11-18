import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useChallengeStore } from './challengeStore';
import { useProgressStore } from './progressStore';
import { DEFAULT_CONFIG } from '@/services/challengeEngine';
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

beforeEach(() => {
  vi.stubGlobal('localStorage', createLocalStorageMock());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function reset() {
  useChallengeStore.getState().resetChallenge();
  useChallengeStore.getState().setConfig({ ...DEFAULT_CONFIG });
}

describe('challengeStore lifecycle', () => {
  beforeEach(reset);

  it('starts idle with the default config', () => {
    const s = useChallengeStore.getState();
    expect(s.status).toBe('idle');
    expect(s.problems).toEqual([]);
    expect(s.score).toBe(0);
  });

  it('count mode deals exactly questionCount problems', () => {
    useChallengeStore.getState().setConfig({ mode: 'count', questionCount: 3 });
    useChallengeStore.getState().startChallenge();
    const s = useChallengeStore.getState();
    expect(s.status).toBe('playing');
    expect(s.problems).toHaveLength(3);
    expect(s.timeRemaining).toBe(0);
    expect(s.currentIndex).toBe(0);
  });

  it('timed mode initializes the countdown', () => {
    useChallengeStore.getState().setConfig({ mode: 'timed', timeLimit: 120 });
    useChallengeStore.getState().startChallenge();
    expect(useChallengeStore.getState().timeRemaining).toBe(120);
  });

  it('refuses to start when no problem matches the filters', () => {
    useChallengeStore.getState().setConfig({ layers: ['pragmatic'] });
    useChallengeStore.getState().startChallenge();
    expect(useChallengeStore.getState().status).toBe('idle');
  });

  it('scores a correct answer and builds the streak', () => {
    useChallengeStore.getState().setConfig({ mode: 'count', questionCount: 5 });
    useChallengeStore.getState().startChallenge();
    const problem = useChallengeStore.getState().problems[0];
    useChallengeStore.getState().submitAnswer(problem.test.id, problem.test.correct_answer);
    const s = useChallengeStore.getState();
    expect(s.answers).toHaveLength(1);
    expect(s.answers[0].correct).toBe(true);
    expect(s.score).toBeGreaterThan(0);
    expect(s.streak).toBe(1);
    expect(s.maxStreak).toBe(1);
    expect(s.showingFeedback).toBe(true);
  });

  it('a wrong answer resets the streak but keeps maxStreak', () => {
    useChallengeStore.getState().setConfig({ mode: 'count', questionCount: 5 });
    useChallengeStore.getState().startChallenge();
    const store = useChallengeStore.getState();
    const p0 = store.problems[0];
    store.submitAnswer(p0.test.id, p0.test.correct_answer);
    useChallengeStore.getState().nextProblem();
    const p1 = useChallengeStore.getState().problems[1];
    const wrong = p1.test.options.find((o) => o !== p1.test.correct_answer)!;
    useChallengeStore.getState().submitAnswer(p1.test.id, wrong);
    const s = useChallengeStore.getState();
    expect(s.streak).toBe(0);
    expect(s.maxStreak).toBe(1);
    expect(s.answers[1].correct).toBe(false);
    expect(s.answers[1].score).toBe(0);
  });

  it('nextProblem advances and clears feedback', () => {
    useChallengeStore.getState().setConfig({ mode: 'count', questionCount: 2 });
    useChallengeStore.getState().startChallenge();
    const p0 = useChallengeStore.getState().problems[0];
    useChallengeStore.getState().submitAnswer(p0.test.id, p0.test.correct_answer);
    useChallengeStore.getState().nextProblem();
    const s = useChallengeStore.getState();
    expect(s.currentIndex).toBe(1);
    expect(s.showingFeedback).toBe(false);
    expect(s.status).toBe('playing');
  });

  it('finishes after the last problem', () => {
    useChallengeStore.getState().setConfig({ mode: 'count', questionCount: 1 });
    useChallengeStore.getState().startChallenge();
    const p0 = useChallengeStore.getState().problems[0];
    useChallengeStore.getState().submitAnswer(p0.test.id, p0.test.correct_answer);
    useChallengeStore.getState().nextProblem();
    expect(useChallengeStore.getState().status).toBe('finished');
  });

  it('tick counts down and finishes at zero', () => {
    useChallengeStore.getState().setConfig({ mode: 'timed', timeLimit: 2 });
    useChallengeStore.getState().startChallenge();
    useChallengeStore.getState().tick();
    expect(useChallengeStore.getState().timeRemaining).toBe(1);
    expect(useChallengeStore.getState().status).toBe('playing');
    useChallengeStore.getState().tick();
    expect(useChallengeStore.getState().timeRemaining).toBe(0);
    expect(useChallengeStore.getState().status).toBe('finished');
  });

  it('tick is a no-op outside playing state', () => {
    useChallengeStore.getState().tick();
    expect(useChallengeStore.getState().status).toBe('idle');
  });

  it('resetChallenge returns to a clean idle state', () => {
    useChallengeStore.getState().setConfig({ mode: 'count', questionCount: 2 });
    useChallengeStore.getState().startChallenge();
    const p0 = useChallengeStore.getState().problems[0];
    useChallengeStore.getState().submitAnswer(p0.test.id, p0.test.correct_answer);
    useChallengeStore.getState().resetChallenge();
    const s = useChallengeStore.getState();
    expect(s.status).toBe('idle');
    expect(s.problems).toEqual([]);
    expect(s.answers).toEqual([]);
    expect(s.score).toBe(0);
    expect(s.streak).toBe(0);
    expect(s.currentIndex).toBe(0);
  });
});

// Regression for issue #3: double-submit scoring and per-question timing.
describe('challengeStore submission guards (issue #3)', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.useRealTimers();
  });

  function startCount(count: number) {
    useChallengeStore.getState().setConfig({ mode: 'count', questionCount: count });
    useChallengeStore.getState().startChallenge();
  }

  it('ignores a second submit for the same problem (double-click race)', () => {
    startCount(3);
    const p0 = useChallengeStore.getState().problems[0];
    useChallengeStore.getState().submitAnswer(p0.test.id, p0.test.correct_answer);
    const afterFirst = useChallengeStore.getState();
    // Same-frame second call: UI closure still sees showingFeedback=false.
    useChallengeStore.getState().submitAnswer(p0.test.id, p0.test.correct_answer);
    const s = useChallengeStore.getState();
    expect(s.answers).toHaveLength(1);
    expect(s.score).toBe(afterFirst.score);
    expect(s.streak).toBe(1);
  });

  it('ignores submits after the challenge finished (timeout race)', () => {
    useChallengeStore.getState().setConfig({ mode: 'timed', timeLimit: 1 });
    useChallengeStore.getState().startChallenge();
    useChallengeStore.getState().tick(); // expires → finished
    expect(useChallengeStore.getState().status).toBe('finished');
    const p0 = useChallengeStore.getState().problems[0];
    useChallengeStore.getState().submitAnswer(p0.test.id, p0.test.correct_answer);
    expect(useChallengeStore.getState().answers).toEqual([]);
    expect(useChallengeStore.getState().score).toBe(0);
  });

  it('ignores nextProblem once finished (stale auto-advance timer)', () => {
    startCount(2);
    const p0 = useChallengeStore.getState().problems[0];
    useChallengeStore.getState().submitAnswer(p0.test.id, p0.test.correct_answer);
    useChallengeStore.getState().nextProblem();
    const p1 = useChallengeStore.getState().problems[1];
    useChallengeStore.getState().submitAnswer(p1.test.id, p1.test.correct_answer);
    useChallengeStore.getState().nextProblem(); // finishes
    useChallengeStore.getState().nextProblem(); // stale timer fires again
    const s = useChallengeStore.getState();
    expect(s.status).toBe('finished');
    expect(s.currentIndex).toBe(1);
    expect(s.answers).toHaveLength(2);
  });

  it('timeMs measures per-question elapsed time, not time since challenge start', () => {
    vi.useFakeTimers();
    vi.setSystemTime(10_000);
    startCount(2);

    vi.setSystemTime(13_000); // 3s spent on question 1
    const p0 = useChallengeStore.getState().problems[0];
    useChallengeStore.getState().submitAnswer(p0.test.id, p0.test.correct_answer);
    expect(useChallengeStore.getState().answers[0].timeMs).toBe(3_000);

    vi.setSystemTime(15_000); // 2s of feedback before advancing
    useChallengeStore.getState().nextProblem();

    vi.setSystemTime(15_500); // 0.5s on question 2
    const p1 = useChallengeStore.getState().problems[1];
    useChallengeStore.getState().submitAnswer(p1.test.id, p1.test.correct_answer);
    expect(useChallengeStore.getState().answers[1].timeMs).toBe(500);
  });
});

// Regression for issue #17: challenge answers must feed the mastery system.
describe('challenge mastery integration (issue #17)', () => {
  const conceptLayers: Record<string, Layer> = { literal_values: 'lexical' };
  const totals: Record<Layer, number> = { lexical: 1, morphological: 0, syntax: 0, semantic: 0, pragmatic: 0 };

  beforeEach(() => {
    reset();
    useProgressStore.setState({
      conceptProgress: {},
      layerProgress: { lexical: 0, morphological: 0, syntax: 0, semantic: 0, pragmatic: 0 },
      conceptLayers: {},
      totalPerLayer: { lexical: 0, morphological: 0, syntax: 0, semantic: 0, pragmatic: 0 },
    });
    useProgressStore.getState().load(conceptLayers, totals);
  });

  function startWithConcept(conceptId: string) {
    // Restrict the pool to one concept's layer+difficulty via config, then find it.
    useChallengeStore.getState().setConfig({ mode: 'count', questionCount: 50 });
    useChallengeStore.getState().startChallenge();
    const idx = useChallengeStore.getState().problems.findIndex((p) => p.concept.id === conceptId);
    expect(idx, `concept ${conceptId} must be in the pool`).toBeGreaterThanOrEqual(0);
    // Advance to the target problem without answering earlier ones.
    useChallengeStore.setState({ currentIndex: idx });
    return useChallengeStore.getState().problems[idx];
  }

  it('a correct challenge answer raises mastery and persists it', () => {
    const problem = startWithConcept('literal_values');
    useChallengeStore.getState().submitAnswer(problem.test.id, problem.test.correct_answer);
    const progress = useProgressStore.getState();
    expect(progress.getMasteryScore('literal_values')).toBeCloseTo(0.3);
    expect(progress.getConceptStatus('literal_values')).toBe('practicing');
    const persisted = JSON.parse(localStorage.getItem('langmaster_progress')!);
    expect(persisted.literal_values.attempts).toBe(1);
  });

  it('a wrong challenge answer lowers mastery like explore mode', () => {
    useProgressStore.setState({
      conceptProgress: { literal_values: { ...defaultConceptProgress(), mastery_score: 0.5, attempts: 2 } },
    });
    const problem = startWithConcept('literal_values');
    const wrong = problem.test.options.find((o) => o !== problem.test.correct_answer)!;
    useChallengeStore.getState().submitAnswer(problem.test.id, wrong);
    expect(useProgressStore.getState().getMasteryScore('literal_values')).toBeCloseTo(0.45);
  });

  it('repeated correct answers can master a concept through challenge alone', () => {
    const problem = startWithConcept('literal_values');
    for (let i = 0; i < 3; i++) {
      useChallengeStore.setState({ showingFeedback: false });
      useChallengeStore.getState().submitAnswer(problem.test.id, problem.test.correct_answer);
    }
    const progress = useProgressStore.getState();
    expect(progress.getConceptStatus('literal_values')).toBe('mastered');
    expect([...progress.getMasteredConceptIds()]).toContain('literal_values');
    expect(progress.layerProgress.lexical).toBe(1);
  });
});
