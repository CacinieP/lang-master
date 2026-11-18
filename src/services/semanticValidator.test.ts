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
};

describe('checkAnswer', () => {
  it('accepts the exact correct answer', () => {
    expect(checkAnswer(test, '15').correct).toBe(true);
  });

  it('rejects any other option (strict equality)', () => {
    expect(checkAnswer(test, '10').correct).toBe(false);
    expect(checkAnswer(test, '15 ').correct).toBe(false);
  });

  it('gives a Chinese explanation by default', () => {
    expect(checkAnswer(test, '15').explanation).toContain('正确');
    expect(checkAnswer(test, '10').explanation).toContain('正确答案是：15');
  });

  it('gives an English explanation when requested', () => {
    expect(checkAnswer(test, '15', 'en').explanation).toContain('Correct');
    expect(checkAnswer(test, '10', 'en').explanation).toContain('The correct answer is: 15');
  });

  it('appends the trap note when present', () => {
    const withTrap = { ...test, trap_note: '注意整除' };
    expect(checkAnswer(withTrap, '15').explanation).toContain('注意整除');
    expect(checkAnswer(withTrap, '10').explanation).toContain('注意整除');
    expect(checkAnswer(withTrap, '10', 'en').explanation).toContain('注意整除');
  });
});
