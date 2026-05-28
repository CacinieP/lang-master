// Alpha languages (Phase 1: 4 languages)
export const ALPHA_LANGUAGES = ['python', 'c', 'java', 'rust'] as const;
export type AlphaLanguage = (typeof ALPHA_LANGUAGES)[number];

// Full 10 languages (for Beta+)
export const ALL_LANGUAGES = [
  'python', 'c', 'java', 'cpp', 'csharp',
  'javascript', 'go', 'rust', 'swift', 'r',
] as const;
export type Language = (typeof ALL_LANGUAGES)[number];

// Linguistic layers (C5)
export const LAYERS = ['lexical', 'morphological', 'syntax', 'semantic', 'pragmatic'] as const;
export type Layer = (typeof LAYERS)[number];

// Programming paradigms (C1)
export const PARADIGMS = ['procedural', 'oop', 'functional', 'concurrent'] as const;
export type Paradigm = (typeof PARADIGMS)[number];

// Difficulty levels (C2)
export type Difficulty = 1 | 2 | 3 | 4 | 5;

// Single language's expression of a concept
export interface LanguageExpression {
  code: string;
  explanation: string;
  explanation_en?: string;
  output: string | null;
  output_explanation?: string;
  paradigm: Paradigm;
  equivalent_expressions?: string[];
  layer_note: string;
  highlight_tokens?: string[];
  is_native?: boolean;
  alternative?: string;
}

// Negative transfer trap (C3)
export interface Trap {
  description: string;
  severity: 'low' | 'medium' | 'high';
  example_wrong: string;
  example_correct: string;
  explanation: string;
}

// Positive transfer
export interface PositiveTransfer {
  description: string;
  strength: 'low' | 'medium' | 'high';
  note: string;
}

// Dependency edge reference (inline in concept)
export interface ConceptDependency {
  id: string;
  type: 'prerequisite' | 'related' | 'contrast' | 'compose';
  strength: number;
}

// Semantic verification test (C6)
export interface SemanticTest {
  id: string;
  type: 'select_output' | 'identify_equivalent';
  question: string;
  question_en?: string;
  correct_answer: string;
  options: string[];
  language_context: AlphaLanguage;
  difficulty: Difficulty;
  trap_note?: string;
  sandbox_required?: boolean;
}

// Core concept node
export interface ConceptNode {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  layer: Layer;
  layer_position: number;
  paradigm_tags: Paradigm[];
  difficulty: Difficulty;
  new_concept_count: number;
  expressions: Partial<Record<AlphaLanguage, LanguageExpression>>;
  traps: Partial<Record<`${AlphaLanguage}_to_${AlphaLanguage}`, Trap>>;
  positive_transfers: Partial<Record<`${AlphaLanguage}_to_${AlphaLanguage}`, PositiveTransfer>>;
  dependencies: ConceptDependency[];
  related: ConceptDependency[];
  contrasts: ConceptDependency[];
  semantic_tests: SemanticTest[];
}

// Category for organizing concepts (C1: by concept domain, not by language)
export interface ConceptCategory {
  key: string;
  label: string;
  label_en: string;
  layer: Layer;
  conceptIds: string[];
}
