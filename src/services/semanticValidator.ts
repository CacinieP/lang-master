import type { SemanticTest } from '@/types';

export interface ValidationResult {
  correct: boolean;
  explanation?: string;
}

export function checkAnswer(
  test: SemanticTest,
  selectedAnswer: string,
  lang: 'zh' | 'en' = 'zh',
): ValidationResult {
  const isCorrect = selectedAnswer === test.correct_answer;

  let explanation: string;
  if (isCorrect) {
    const prefix = lang === 'zh' ? '正确！' : 'Correct! ';
    explanation = test.trap_note
      ? `${prefix}${test.trap_note}`
      : prefix;
  } else {
    if (lang === 'zh') {
      explanation = `正确答案是：${test.correct_answer}`;
    } else {
      explanation = `The correct answer is: ${test.correct_answer}`;
    }
    if (test.trap_note) {
      explanation += `. ${test.trap_note}`;
    }
  }

  return { correct: isCorrect, explanation };
}
