import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useChallengeStore } from './challengeStore';
import { useProgressStore } from './progressStore';
import { DEFAULT_CONFIG } from '@/services/challengeEngine';
import { defaultConceptProgress, defaultChallengeStats } from '@/types';
import { loadChallengeStats } from '@/services/storage';
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
    // Use the FULL bank (questionCount > 120) so the target concept is
    // guaranteed in the pool — a random 50-question slice missed it ~9% of
    // the time (issue #24 flaky CI).
    useChallengeStore.getState().setConfig({ mode: 'count', questionCount: 1000 });
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

// Issue #18: challenge results must persist (best score, history, records).
describe('challenge stats settlement (issue #18)', () => {
  beforeEach(() => {
    reset();
    useChallengeStore.setState({ stats: defaultChallengeStats(), isNewRecord: false });
  });

  function fakeRun(score: number, correct: number, total: number) {
    const answers = Array.from({ length: total }, (_, i) => ({
      testId: `t${i}`,
      selected: 'x',
      correct: i < correct,
      timeMs: 100,
      score: i < correct ? Math.round(score / Math.max(correct, 1)) : 0,
    }));
    useChallengeStore.setState({ status: 'playing', score, answers });
    useChallengeStore.getState().finishChallenge();
  }

  it('first finished run persists stats and flags a new record', () => {
    fakeRun(500, 5, 10);
    const s = useChallengeStore.getState();
    expect(s.status).toBe('finished');
    expect(s.isNewRecord).toBe(true);
    expect(s.stats.bestScore).toBe(500);
    expect(s.stats.gamesPlayed).toBe(1);
    expect(s.stats.totalCorrect).toBe(5);
    expect(s.stats.totalAnswered).toBe(10);
    expect(s.stats.history[0]).toMatchObject({ score: 500, accuracy: 50, correct: 5, total: 10 });
    const persisted = JSON.parse(localStorage.getItem('langmaster_challenge_stats')!);
    expect(persisted.bestScore).toBe(500);
  });

  it('finishChallenge is idempotent (no double settlement)', () => {
    fakeRun(500, 5, 10);
    useChallengeStore.getState().finishChallenge();
    expect(useChallengeStore.getState().stats.gamesPlayed).toBe(1);
  });

  it('a lower second run keeps the record flag off; a higher run sets it', () => {
    fakeRun(500, 5, 10);
    useChallengeStore.getState().resetChallenge();
    fakeRun(300, 3, 10);
    expect(useChallengeStore.getState().isNewRecord).toBe(false);
    expect(useChallengeStore.getState().stats.bestScore).toBe(500);
    useChallengeStore.getState().resetChallenge();
    fakeRun(900, 9, 10);
    expect(useChallengeStore.getState().isNewRecord).toBe(true);
    expect(useChallengeStore.getState().stats.bestScore).toBe(900);
    expect(useChallengeStore.getState().stats.gamesPlayed).toBe(3);
  });

  it('a zero-score run is never a new record', () => {
    fakeRun(0, 0, 5);
    expect(useChallengeStore.getState().isNewRecord).toBe(false);
    expect(useChallengeStore.getState().stats.gamesPlayed).toBe(1);
  });

  it('history keeps the 10 most recent runs, newest first', () => {
    for (let i = 1; i <= 12; i++) {
      useChallengeStore.getState().resetChallenge();
      fakeRun(i * 100, 1, 2);
    }
    const { history } = useChallengeStore.getState().stats;
    expect(history).toHaveLength(10);
    expect(history[0].score).toBe(1200);
    expect(history[9].score).toBe(300);
  });

  it('resetChallenge keeps persisted stats but clears the record flag', () => {
    fakeRun(500, 5, 10);
    useChallengeStore.getState().resetChallenge();
    const s = useChallengeStore.getState();
    expect(s.isNewRecord).toBe(false);
    expect(s.stats.bestScore).toBe(500);
    expect(loadChallengeStats().bestScore).toBe(500);
  });
});

// Issue #28: settlement must only happen from a live run, and storage
// failures must surface a localized toast like the other stores.
describe('settlement hardening (issue #28)', () => {
  beforeEach(() => {
    reset();
    useChallengeStore.setState({ stats: defaultChallengeStats(), isNewRecord: false });
  });

  it('ignores finishChallenge from idle (no empty-game settlement)', () => {
    expect(useChallengeStore.getState().status).toBe('idle');
    useChallengeStore.getState().finishChallenge();
    const s = useChallengeStore.getState();
    expect(s.status).toBe('idle');
    expect(s.stats.gamesPlayed).toBe(0);
    expect(s.stats.history).toEqual([]);
    expect(localStorage.getItem('langmaster_challenge_stats')).toBeNull();
  });

  it('ignores finishChallenge after reset following a finished run', () => {
    useChallengeStore.setState({
      status: 'playing',
      score: 100,
      answers: [{ testId: 't', selected: 'x', correct: true, timeMs: 1, score: 100 }],
    });
    useChallengeStore.getState().finishChallenge();
    expect(useChallengeStore.getState().stats.gamesPlayed).toBe(1);
    useChallengeStore.getState().resetChallenge();
    useChallengeStore.getState().finishChallenge(); // stale callback
    expect(useChallengeStore.getState().stats.gamesPlayed).toBe(1);
  });

  it('surfaces a localized toast when stats cannot be saved', async () => {
    const { useUIStore } = await import('./uiStore');
    const { useUserStore } = await import('./userStore');
    const { defaultProfile } = await import('@/types');
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {},
      clear: () => {},
    });
    useUserStore.setState({ profile: { ...defaultProfile(), ui_language: 'en' } });
    useUIStore.setState({ toasts: [] });
    useChallengeStore.setState({
      status: 'playing',
      score: 100,
      answers: [{ testId: 't', selected: 'x', correct: true, timeMs: 1, score: 100 }],
    });
    useChallengeStore.getState().finishChallenge();
    const toasts = useUIStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].text).toBe('Save failed — check browser storage');
    expect(useChallengeStore.getState().status).toBe('finished');
  });
});
