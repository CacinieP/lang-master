import { useState } from 'react';
import type { ConceptNode } from '@/types';
import { checkAnswer } from '@/services/semanticValidator';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';
import { QuestionText } from '../common/QuestionText';
import { t } from '@/utils/i18n';
import './SemanticQuiz.css';

interface Props {
  concept: ConceptNode;
}

export function SemanticQuiz({ concept }: Props) {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const recordQuizResult = useProgressStore((s) => s.recordQuizResult);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const zh = uiLanguage === 'zh';

  const tests = concept.semantic_tests;
  if (tests.length === 0) return null;

  const allAnswered = results.length === tests.length;
  if (allAnswered) {
    const correctCount = results.filter(Boolean).length;
    return (
      <div className="semantic-quiz">
        <h4 className="quiz-title">{zh ? '测验完成！' : 'Quiz Complete!'}</h4>
        <div className="quiz-summary">
          <p className="quiz-summary-score">
            {zh ? `答对 ${correctCount}/${tests.length} 题` : `${correctCount}/${tests.length} correct`}
          </p>
          <div className="quiz-summary-bar">
            <div className="quiz-summary-fill" style={{ width: `${(correctCount / tests.length) * 100}%` }} />
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setCurrentTestIndex(0);
            setSelectedAnswer(null);
            setShowResult(false);
            setResults([]);
          }}
        >
          {zh ? '重新测验' : 'Retry'}
        </button>
      </div>
    );
  }

  const test = tests[currentTestIndex];
  if (!test) return null;

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setShowResult(true);
    const result = checkAnswer(test, selectedAnswer, uiLanguage);
    recordQuizResult(concept.id, concept.layer, result.correct);
    setResults((prev) => [...prev, result.correct]);
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
        <QuestionText
          text={uiLanguage === 'zh' ? test.question : (test.question_en || test.question)}
          fallbackLanguage={test.language_context}
        />
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

      {showResult && selectedAnswer && (() => {
        const result = checkAnswer(test, selectedAnswer, uiLanguage);
        return (
          <div className="quiz-feedback">
            <div className={`quiz-result ${result.correct ? 'correct' : 'wrong'}`}>
              {result.feedback}
            </div>
            <div className="quiz-explanation">
              <span className="explanation-label">{t('explanation_label', uiLanguage)}</span>
              {result.explanation}
            </div>
            {result.trap_note && (
              <div className="quiz-trap-note">⚠ {result.trap_note}</div>
            )}
          </div>
        );
      })()}

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
          <button className="btn-primary" onClick={handleNext}>
            {currentTestIndex < tests.length - 1
              ? (zh ? '下一题' : 'Next')
              : (zh ? '查看结果' : 'View Results')}
          </button>
        )}
      </div>
    </div>
  );
}
