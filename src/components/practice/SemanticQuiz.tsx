import { useState } from 'react';
import type { ConceptNode } from '@/types';
import { checkAnswer } from '@/services/semanticValidator';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';
import { CodeBlock } from '../concept/CodeBlock';
import './SemanticQuiz.css';

interface Props {
  concept: ConceptNode;
}

export function SemanticQuiz({ concept }: Props) {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const recordQuizResult = useProgressStore((s) => s.recordQuizResult);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);

  const tests = concept.semantic_tests;
  if (tests.length === 0) return null;

  const test = tests[currentTestIndex];
  if (!test) return null;

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setShowResult(true);
    const result = checkAnswer(test, selectedAnswer);
    recordQuizResult(concept.id, concept.layer, result.correct);
  };

  const handleNext = () => {
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="semantic-quiz">
      <h4 className="quiz-title">
        {uiLanguage === 'zh' ? '语义验证' : 'Semantic Verification'}
        <span className="quiz-progress">{currentTestIndex + 1}/{tests.length}</span>
      </h4>

      <div className="quiz-question">
        {test.question.split('```').map((part, i) =>
          i % 2 === 1 ? (
            <CodeBlock key={i} code={part.trim()} language={test.language_context} />
          ) : (
            <p key={i} className="question-text">{part}</p>
          ),
        )}
      </div>

      <div className="quiz-options">
        {test.options.map((option, i) => (
          <label
            key={i}
            className={`quiz-option ${selectedAnswer === option ? 'selected' : ''} ${
              showResult && option === test.correct_answer ? 'correct' : ''
            } ${showResult && selectedAnswer === option && option !== test.correct_answer ? 'wrong' : ''}`}
          >
            <input
              type="radio"
              name={`quiz-${test.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
            />
            <code>{option}</code>
          </label>
        ))}
      </div>

      <div className="quiz-actions">
        {!showResult ? (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            {uiLanguage === 'zh' ? '提交' : 'Submit'}
          </button>
        ) : (
          <>
            <div className={`quiz-result ${selectedAnswer === test.correct_answer ? 'correct' : 'wrong'}`}>
              {selectedAnswer === test.correct_answer
                ? (uiLanguage === 'zh' ? '正确！' : 'Correct!')
                : (uiLanguage === 'zh' ? '不正确' : 'Incorrect')}
            </div>
            {currentTestIndex < tests.length - 1 && (
              <button className="btn-primary" onClick={handleNext}>
                {uiLanguage === 'zh' ? '下一题' : 'Next'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
