import type { AlphaLanguage, Layer } from './concept';

export type ConceptStatus = 'unvisited' | 'exploring' | 'practicing' | 'mastered';
export type Proficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface LanguageExperience {
  language: AlphaLanguage;
  proficiency: Proficiency;
  self_assessed: boolean;
}

export interface ConceptProgress {
  status: ConceptStatus;
  attempts: number;
  last_attempted_at: number;
  best_result: 'partial' | 'passed' | 'mastered';
  mastery_score: number; // 0-1
  layer_progress: Record<Layer, number>;
  language_progress: Partial<Record<AlphaLanguage, number>>;
}

export interface UserProfile {
  profile_id: string;
  created_at: number;
  last_accessed: number;
  ui_language: 'zh' | 'en';
  known_languages: LanguageExperience[];
  current_focus_language: AlphaLanguage | null;
  learning_path: 'path_a' | 'path_b' | 'path_c' | 'custom';
  concept_progress: Record<string, ConceptProgress>;
  settings: UserSettings;
  onboarding_completed: boolean;
}

export interface UserSettings {
  dark_mode: boolean;
  font_scale: number;
  language_display_random: boolean;
  show_traps_auto: boolean;
  default_mode: 'explore' | 'challenge' | 'master';
}

export function defaultProfile(): UserProfile {
  return {
    profile_id: crypto.randomUUID(),
    created_at: Date.now(),
    last_accessed: Date.now(),
    ui_language: 'zh',
    known_languages: [],
    current_focus_language: null,
    learning_path: 'path_b',
    concept_progress: {},
    settings: {
      dark_mode: true,
      font_scale: 1.0,
      language_display_random: true,
      show_traps_auto: true,
      default_mode: 'explore',
    },
    onboarding_completed: false,
  };
}

export function defaultConceptProgress(): ConceptProgress {
  return {
    status: 'unvisited',
    attempts: 0,
    last_attempted_at: 0,
    best_result: 'partial',
    mastery_score: 0,
    layer_progress: {
      lexical: 0,
      morphological: 0,
      syntax: 0,
      semantic: 0,
      pragmatic: 0,
    },
    language_progress: {},
  };
}
