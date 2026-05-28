import type { UserProfile, ConceptProgress } from '@/types';
import { defaultProfile } from '@/types';

const STORAGE_KEYS = {
  profile: 'langmaster_profile',
  progress: 'langmaster_progress',
  settings: 'langmaster_settings',
  ui_state: 'lm_ui_state',
  concept_cache: 'lm_concept_cache_hot',
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

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full — silently fail
  }
}

// --- Profile ---

export function loadProfile(): UserProfile {
  const stored = read<Partial<UserProfile> | null>(STORAGE_KEYS.profile, null);
  if (!stored) return defaultProfile();
  return { ...defaultProfile(), ...stored };
}

export function saveProfile(profile: UserProfile): void {
  write(STORAGE_KEYS.profile, profile);
}

// --- Progress ---

export function loadProgress(): Record<string, ConceptProgress> {
  return read<Record<string, ConceptProgress>>(STORAGE_KEYS.progress, {});
}

export function saveProgress(progress: Record<string, ConceptProgress>): void {
  write(STORAGE_KEYS.progress, progress);
}

// --- Clear ---

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
