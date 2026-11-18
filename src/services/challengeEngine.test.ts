import { describe, expect, it } from 'vitest';
import {
  assembleProblems,
  countAvailableProblems,
  calculateScore,
  DEFAULT_CONFIG,
} from './challengeEngine';
import { CONCEPT_NODES } from '@/data/concepts';

describe('assembleProblems', () => {
  it('default config covers every Alpha test (all are P1-P3 in the three layers)', () => {
    const total = CONCEPT_NODES.reduce((n, c) => n + c.semantic_tests.length, 0);
    expect(countAvailableProblems(DEFAULT_CONFIG)).toBe(total);
    const problems = assembleProblems(DEFAULT_CONFIG);
    expect(problems).toHaveLength(total);
  });

  it('assigns sequential indices', () => {
    const problems = assembleProblems(DEFAULT_CONFIG);
    problems.forEach((p, i) => expect(p.index).toBe(i));
  });

  it('count mode slices to questionCount and re-indexes', () => {
    const problems = assembleProblems({ ...DEFAULT_CONFIG, mode: 'count', questionCount: 5 });
    expect(problems).toHaveLength(5);
    problems.forEach((p, i) => expect(p.index).toBe(i));
  });

  it('count mode never exceeds the available pool', () => {
    const problems = assembleProblems({ ...DEFAULT_CONFIG, mode: 'count', questionCount: 10_000 });
    expect(problems.length).toBe(countAvailableProblems(DEFAULT_CONFIG));
  });

  it('filters by layer', () => {
    const config = { ...DEFAULT_CONFIG, layers: ['lexical' as const] };
    const problems = assembleProblems(config);
    expect(problems.length).toBe(countAvailableProblems(config));
    for (const p of problems) expect(p.concept.layer).toBe('lexical');
  });

  it('filters by maxDifficulty', () => {
    const config = { ...DEFAULT_CONFIG, maxDifficulty: 1 };
    const problems = assembleProblems(config);
    for (const p of problems) expect(p.concept.difficulty).toBeLessThanOrEqual(1);
  });

  it('returns an empty pool when nothing matches', () => {
    const config = { ...DEFAULT_CONFIG, layers: ['pragmatic' as const] };
    expect(countAvailableProblems(config)).toBe(0);
    expect(assembleProblems(config)).toEqual([]);
  });

  it('keeps every problem attached to its own concept test', () => {
    for (const p of assembleProblems(DEFAULT_CONFIG)) {
      expect(p.concept.semantic_tests).toContain(p.test);
    }
  });
});

describe('calculateScore', () => {
  it('wrong answers score 0 regardless of bonuses', () => {
    expect(calculateScore(false, 3, 10, 300, 300)).toBe(0);
  });

  it('difficulty multiplier: P1=100, P2=150, P3=200', () => {
    expect(calculateScore(true, 1, 0)).toBe(100);
    expect(calculateScore(true, 2, 0)).toBe(150);
    expect(calculateScore(true, 3, 0)).toBe(200);
  });

  it('streak bonus is +50 per streak, capped at +200', () => {
    expect(calculateScore(true, 1, 1)).toBe(150);
    expect(calculateScore(true, 1, 4)).toBe(300);
    expect(calculateScore(true, 1, 9)).toBe(300);
  });

  it('time bonus scales with remaining fraction, up to +50', () => {
    expect(calculateScore(true, 1, 0, 300, 300)).toBe(150);
    expect(calculateScore(true, 1, 0, 150, 300)).toBe(125);
    expect(calculateScore(true, 1, 0, 0, 300)).toBe(100);
  });

  it('ignores time bonus when timeLimit is 0 or missing', () => {
    expect(calculateScore(true, 1, 0, 100, 0)).toBe(100);
    expect(calculateScore(true, 1, 0)).toBe(100);
  });

  it('combines difficulty, streak and time', () => {
    // P3 base 200 + streak cap 200 + full time 50
    expect(calculateScore(true, 3, 6, 300, 300)).toBe(450);
  });
});
