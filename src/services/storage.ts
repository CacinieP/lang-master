import type { UserProfile, ConceptProgress, ChallengeStats } from '@/types';
import { defaultProfile, defaultChallengeStats } from '@/types';

const STORAGE_KEYS = {
  profile: 'langmaster_profile',
  progress: 'langmaster_progress',
  settings: 'langmaster_settings',
  ui_state: 'lm_ui_state',
  concept_cache: 'lm_concept_cache_hot',
  challenge_stats: 'langmaster_challenge_stats',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// --- Profile ---

export function loadProfile(): UserProfile {
  const stored = read<Partial<UserProfile> | null>(STORAGE_KEYS.profile, null);
  if (!stored) return defaultProfile();
  return { ...defaultProfile(), ...stored };
}

export function saveProfile(profile: UserProfile): boolean {
  return write(STORAGE_KEYS.profile, profile);
}

// --- Progress ---

export function loadProgress(): Record<string, ConceptProgress> {
  return read<Record<string, ConceptProgress>>(STORAGE_KEYS.progress, {});
}

export function saveProgress(progress: Record<string, ConceptProgress>): boolean {
  return write(STORAGE_KEYS.progress, progress);
}

// --- Challenge stats (issue #18) ---

export function loadChallengeStats(): ChallengeStats {
  const stored = read<Partial<ChallengeStats> | null>(STORAGE_KEYS.challenge_stats, null);
  if (!stored) return defaultChallengeStats();
  const defaults = defaultChallengeStats();
  return {
    ...defaults,
    ...stored,
    history: Array.isArray(stored.history) ? stored.history.slice(0, 10) : [],
  };
}

export function saveChallengeStats(stats: ChallengeStats): boolean {
  return write(STORAGE_KEYS.challenge_stats, stats);
}

// --- Clear ---

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
