import { describe, expect, it } from 'vitest';
import { CONCEPT_NODES } from './index';

// Regression for issue #11: these option strings were semantically equivalent
// to the correct answer (multiple defensible answers). They must not return.
const BANNED_OPTIONS: Record<string, string[]> = {
  cf_for_03: ['for i in range(0, 5, 1)'],
  loop_keywords_semantic_3: [
    '等同于while true { break; }',
    '等同于for _ in std::iter::repeat() { break; }',
  ],
  fn_ret_03: ['struct Pair f(int a, int b) { return {a, b}; }'],
  comments_semantic_2: ['/* 注释 */'],
  cf_while_03: ['action()\nwhile cond:\n    action()'],
  str_interp_02: ['"Age: " + age'],
  func_call_02: ['let result = (x * x + y * y).sqrt();'],
  pm_03: ['if x == 1 { ... } else { ... }'],
  cf_cond_03: ['let grade = match score >= 90 { true => "A", false => "B" };'],
};

// Questions reworded to make the intended answer unique (issue #11).
const REQUIRED_QUESTION_FRAGMENTS: Record<string, string> = {
  member_acc_03: 'private',
  variable_declaration_semantic_2: '显式声明',
};

const allTests = new Map(
  CONCEPT_NODES.flatMap((c) => c.semantic_tests.map((t) => [t.id, t] as const)),
);

describe('ambiguous-option regressions (issue #11)', () => {
  it.each(Object.entries(BANNED_OPTIONS))('%s: equivalent distractors removed', (id, banned) => {
    const test = allTests.get(id);
    expect(test, `test ${id} must exist`).toBeDefined();
    for (const option of banned) {
      expect(test!.options, `${id} must not offer "${option}"`).not.toContain(option);
    }
    expect(test!.options).toContain(test!.correct_answer);
  });

  it.each(Object.entries(REQUIRED_QUESTION_FRAGMENTS))(
    '%s: question keeps the uniqueness qualifier',
    (id, fragment) => {
      const test = allTests.get(id);
      expect(test, `test ${id} must exist`).toBeDefined();
      expect(test!.question).toContain(fragment);
    },
  );
});
