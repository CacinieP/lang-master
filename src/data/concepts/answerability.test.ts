import { describe, expect, it } from 'vitest';
import { CONCEPT_NODES } from './index';

// Regression for issue #1: a semantic test whose correct_answer is not present
// in its options can never be answered correctly (semanticValidator uses strict
// equality). Guard every question so this class of data bug cannot recur.
describe('semantic test answerability (C6)', () => {
  const cases = CONCEPT_NODES.flatMap((concept) =>
    concept.semantic_tests.map((test) => ({ conceptId: concept.id, test })),
  );

  it('has at least one semantic test per concept', () => {
    for (const concept of CONCEPT_NODES) {
      expect(concept.semantic_tests.length, concept.id).toBeGreaterThanOrEqual(1);
    }
  });

  it.each(cases.map((c) => [c.test.id, c] as const))(
    '%s: correct_answer is one of the options',
    (_id, { conceptId, test }) => {
      expect(
        test.options,
        `${conceptId}/${test.id}: correct_answer "${test.correct_answer}" must appear in options`,
      ).toContain(test.correct_answer);
    },
  );

  it.each(cases.map((c) => [c.test.id, c] as const))(
    '%s: options are unique and at least two',
    (_id, { conceptId, test }) => {
      expect(new Set(test.options).size, `${conceptId}/${test.id}: duplicate options`).toBe(
        test.options.length,
      );
      expect(test.options.length, `${conceptId}/${test.id}: needs >=2 options`).toBeGreaterThanOrEqual(2);
    },
  );
});
