import type { ConceptNode, SemanticTest, Layer } from '@/types';
import { CONCEPT_NODES } from '@/data/concepts';
import { shuffle } from '@/utils/shuffle';

export interface ChallengeProblem {
  test: SemanticTest;
  concept: ConceptNode;
  index: number;
}

export interface ChallengeConfig {
  mode: 'timed' | 'count';
  timeLimit: number; // seconds, for timed mode
  questionCount: number; // for count mode
  layers: Layer[];
  maxDifficulty: number;
}

export const DEFAULT_CONFIG: ChallengeConfig = {
  mode: 'timed',
  timeLimit: 300, // 5 minutes
  questionCount: 20,
  layers: ['lexical', 'morphological', 'syntax'],
  maxDifficulty: 3,
};

export function assembleProblems(config: ChallengeConfig): ChallengeProblem[] {
  const filtered = CONCEPT_NODES.filter((c) => {
    if (!config.layers.includes(c.layer)) return false;
    if (c.difficulty > config.maxDifficulty) return false;
    return true;
  });

  const allTests: ChallengeProblem[] = [];
  for (const concept of filtered) {
    for (const test of concept.semantic_tests) {
      allTests.push({ test, concept, index: allTests.length });
    }
  }

  const shuffled = shuffle(allTests);

  if (config.mode === 'count') {
    return shuffled.slice(0, config.questionCount).map((p, i) => ({ ...p, index: i }));
  }

  return shuffled.map((p, i) => ({ ...p, index: i }));
}

export function countAvailableProblems(config: ChallengeConfig): number {
  return CONCEPT_NODES.filter((c) => {
    if (!config.layers.includes(c.layer)) return false;
    if (c.difficulty > config.maxDifficulty) return false;
    return true;
  }).reduce((sum, c) => sum + c.semantic_tests.length, 0);
}

export function calculateScore(
  correct: boolean,
  difficulty: number,
  streak: number,
  timeRemaining?: number,
  timeLimit?: number,
): number {
  if (!correct) return 0;

  // Base score
  let score = 100;

  // Difficulty multiplier: P1=1, P2=1.5, P3=2
  const diffMult = 1 + (difficulty - 1) * 0.5;
  score = Math.round(score * diffMult);

  // Streak bonus: +50 per consecutive correct, capped at +200
  const streakBonus = Math.min(streak, 4) * 50;
  score += streakBonus;

  // Time bonus (timed mode): up to +50 if answered quickly
  if (timeRemaining !== undefined && timeLimit !== undefined && timeLimit > 0) {
    const timePct = timeRemaining / timeLimit;
    score += Math.round(timePct * 50);
  }

  return score;
}
