import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadProfile,
  saveProfile,
  loadProgress,
  saveProgress,
  loadChallengeStats,
  saveChallengeStats,
  clearAllData,
} from './storage';
import { defaultProfile, defaultConceptProgress, defaultChallengeStats } from '@/types';

// Minimal localStorage mock — keeps the suite in node env (no jsdom dependency).
function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((k: string) => (store.has(k) ? store.get(k)! : null)),
    setItem: vi.fn((k: string, v: string) => {
      store.set(k, String(v));
    }),
    removeItem: vi.fn((k: string) => {
      store.delete(k);
    }),
    clear: vi.fn(() => store.clear()),
    get length() {
      return store.size;
    },
    key: vi.fn((i: number) => [...store.keys()][i] ?? null),
  };
}

let mock: ReturnType<typeof createLocalStorageMock>;

beforeEach(() => {
  mock = createLocalStorageMock();
  vi.stubGlobal('localStorage', mock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('profile persistence', () => {
  it('returns defaults when nothing is stored', () => {
    const profile = loadProfile();
    expect(profile.ui_language).toBe(defaultProfile().ui_language);
    expect(profile.onboarding_completed).toBe(false);
    expect(profile.known_languages).toEqual([]);
  });

  it('round-trips a saved profile', () => {
    const profile = { ...defaultProfile(), ui_language: 'en' as const, onboarding_completed: true };
    expect(saveProfile(profile)).toBe(true);
    const loaded = loadProfile();
    expect(loaded.ui_language).toBe('en');
    expect(loaded.onboarding_completed).toBe(true);
  });

  it('merges stored partial data over defaults (forward compatibility)', () => {
    localStorage.setItem('langmaster_profile', JSON.stringify({ ui_language: 'en' }));
    const loaded = loadProfile();
    expect(loaded.ui_language).toBe('en');
    expect(loaded.settings).toEqual(defaultProfile().settings);
  });

  it('falls back to defaults on corrupted JSON', () => {
    localStorage.setItem('langmaster_profile', '{not json');
    expect(loadProfile().onboarding_completed).toBe(false);
  });

  it('reports write failure instead of throwing (quota / private mode)', () => {
    mock.setItem.mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(saveProfile(defaultProfile())).toBe(false);
  });
});

describe('progress persistence', () => {
  it('returns an empty record when nothing is stored', () => {
    expect(loadProgress()).toEqual({});
  });

  it('round-trips concept progress', () => {
    const progress = { literal_values: { ...defaultConceptProgress(), mastery_score: 0.9, attempts: 3 } };
    expect(saveProgress(progress)).toBe(true);
    expect(loadProgress().literal_values.mastery_score).toBe(0.9);
  });

  it('falls back to {} on corrupted JSON', () => {
    localStorage.setItem('langmaster_progress', '💥');
    expect(loadProgress()).toEqual({});
  });
});

describe('clearAllData', () => {
  it('removes every Lang Master key', () => {
    saveProfile(defaultProfile());
    saveProgress({});
    localStorage.setItem('lm_ui_state', '{}');
    clearAllData();
    expect(localStorage.getItem('langmaster_profile')).toBeNull();
    expect(localStorage.getItem('langmaster_progress')).toBeNull();
    expect(localStorage.getItem('lm_ui_state')).toBeNull();
  });
});

describe('challenge stats persistence (issue #18)', () => {
  it('returns defaults when nothing is stored', () => {
    expect(loadChallengeStats()).toEqual(defaultChallengeStats());
  });

  it('round-trips saved stats', () => {
    const stats = {
      ...defaultChallengeStats(),
      bestScore: 950,
      gamesPlayed: 3,
      totalCorrect: 20,
      totalAnswered: 30,
      history: [{ score: 950, accuracy: 80, correct: 8, total: 10, mode: 'count' as const, playedAt: 123 }],
    };
    expect(saveChallengeStats(stats)).toBe(true);
    expect(loadChallengeStats()).toEqual(stats);
  });

  it('falls back to defaults on corrupted JSON', () => {
    localStorage.setItem('langmaster_challenge_stats', '{oops');
    expect(loadChallengeStats()).toEqual(defaultChallengeStats());
  });

  it('caps loaded history at 10 and tolerates a missing history field', () => {
    const long = Array.from({ length: 15 }, (_, i) => ({
      score: i, accuracy: 0, correct: 0, total: 0, mode: 'count' as const, playedAt: i,
    }));
    localStorage.setItem('langmaster_challenge_stats', JSON.stringify({ bestScore: 5, history: long }));
    const loaded = loadChallengeStats();
    expect(loaded.history).toHaveLength(10);
    expect(loaded.gamesPlayed).toBe(0);
    localStorage.setItem('langmaster_challenge_stats', JSON.stringify({ bestScore: 5 }));
    expect(loadChallengeStats().history).toEqual([]);
  });

  it('clearAllData removes challenge stats too', () => {
    saveChallengeStats({ ...defaultChallengeStats(), bestScore: 100 });
    clearAllData();
    expect(localStorage.getItem('langmaster_challenge_stats')).toBeNull();
  });
});
