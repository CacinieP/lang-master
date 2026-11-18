import type { SemanticTest } from '@/types';

export interface ValidationResult {
  correct: boolean;
  /** Localized right/wrong feedback, incl. the correct answer when wrong. */
  feedback: string;
  /** Localized "why the correct answer is correct" (issue #12). */
  explanation: string;
  /** Why the selected wrong option is wrong (issue #20); undefined when correct. */
  selected_note?: string;
  /** Cross-language transfer note, when the question carries one. */
  trap_note?: string;
}

export function checkAnswer(
  test: SemanticTest,
  selectedAnswer: string,
  lang: 'zh' | 'en' = 'zh',
): ValidationResult {
  const isCorrect = selectedAnswer === test.correct_answer;

  let feedback: string;
  if (isCorrect) {
    feedback = lang === 'zh' ? '正确！' : 'Correct!';
  } else {
    feedback = lang === 'zh'
      ? `正确答案是：${test.correct_answer}`
      : `The correct answer is: ${test.correct_answer}`;
  }

  const explanation = lang === 'en'
    ? (test.explanation_en || test.explanation)
    : test.explanation;

  const selected_note = isCorrect ? undefined : test.option_notes[selectedAnswer];

  return { correct: isCorrect, feedback, explanation, selected_note, trap_note: test.trap_note };
}
