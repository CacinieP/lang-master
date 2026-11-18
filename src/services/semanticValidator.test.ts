import { describe, expect, it } from 'vitest';
import { checkAnswer } from './semanticValidator';
import type { SemanticTest } from '@/types';

const test: SemanticTest = {
  id: 't1',
  type: 'select_output',
  question: '输出是什么？',
  correct_answer: '15',
  options: ['10', '15', '5'],
  language_context: 'java',
  difficulty: 1,
  explanation: '+= 是复合赋值：10 + 5 = 15。',
  explanation_en: '+= is compound assignment: 10 + 5 = 15.',
};

describe('checkAnswer', () => {
  it('accepts the exact correct answer', () => {
    expect(checkAnswer(test, '15').correct).toBe(true);
  });

  it('rejects any other option (strict equality)', () => {
    expect(checkAnswer(test, '10').correct).toBe(false);
    expect(checkAnswer(test, '15 ').correct).toBe(false);
  });

  it('gives Chinese feedback by default', () => {
    expect(checkAnswer(test, '15').feedback).toContain('正确');
    expect(checkAnswer(test, '10').feedback).toContain('正确答案是：15');
  });

  it('gives English feedback when requested', () => {
    expect(checkAnswer(test, '15', 'en').feedback).toContain('Correct');
    expect(checkAnswer(test, '10', 'en').feedback).toContain('The correct answer is: 15');
  });

  it('always returns the localized explanation (issue #12)', () => {
    expect(checkAnswer(test, '15').explanation).toBe(test.explanation);
    expect(checkAnswer(test, '10').explanation).toBe(test.explanation);
    expect(checkAnswer(test, '15', 'en').explanation).toBe(test.explanation_en);
    expect(checkAnswer(test, '10', 'en').explanation).toBe(test.explanation_en);
  });

  it('falls back to the Chinese explanation when English is missing', () => {
    const zhOnly = { ...test, explanation_en: undefined };
    expect(checkAnswer(zhOnly, '15', 'en').explanation).toBe(test.explanation);
  });

  it('passes the trap note through when present', () => {
    const withTrap = { ...test, trap_note: '注意整除' };
    expect(checkAnswer(withTrap, '15').trap_note).toBe('注意整除');
    expect(checkAnswer(withTrap, '10', 'en').trap_note).toBe('注意整除');
    expect(checkAnswer(test, '15').trap_note).toBeUndefined();
  });
});
