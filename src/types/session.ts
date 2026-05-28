import type { AlphaLanguage } from './concept';

export interface ConceptAttempt {
  concept_id: string;
  layer: string;
  difficulty: number;
  code_step: {
    passed: boolean;
    language: AlphaLanguage;
    attempt_count: number;
    time_ms: number;
  };
  semantic_step: {
    passed: boolean;
    test_type: string;
    attempt_count: number;
    time_ms: number;
  };
  final_result: 'passed' | 'partial' | 'failed';
  mastery_delta: number;
}

export interface TrapEncounter {
  trap_id: string;
  trap_shown: boolean;
  trap_avoided: boolean;
  trap_fallen: boolean;
  language_from: AlphaLanguage;
  language_to: AlphaLanguage;
}

export interface SessionStats {
  session_id: string;
  started_at: number;
  ended_at: number;
  duration: number;
  mode: 'explore' | 'challenge' | 'master';
  concepts_attempted: ConceptAttempt[];
  trap_encounters: TrapEncounter[];
}
