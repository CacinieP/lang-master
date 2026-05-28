import type { SemanticTest } from '@/types';

export interface ValidationResult {
  correct: boolean;
  explanation?: string;
}

export function checkAnswer(
  test: SemanticTest,
  selectedAnswer: string,
): ValidationResult {
  const isCorrect = selectedAnswer === test.correct_answer;

  let explanation: string;
  if (isCorrect) {
    explanation = test.trap_note
      ? `正确！${test.trap_note}`
      : '正确！';
  } else {
    explanation = `正确答案是：${test.correct_answer}`;
    if (test.trap_note) {
      explanation += `。${test.trap_note}`;
    }
  }

  return { correct: isCorrect, explanation };
}
