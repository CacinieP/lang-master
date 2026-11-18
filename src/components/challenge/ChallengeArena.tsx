import { useState, useEffect, useCallback } from 'react';
import { useChallengeStore } from '@/store/challengeStore';
import { useUserStore } from '@/store/userStore';
import { ChallengeTimer } from './ChallengeTimer';
import { StreakIndicator } from './StreakIndicator';
import { QuestionText } from '../common/QuestionText';
import { t } from '@/utils/i18n';
import './Challenge.css';

export function ChallengeArena() {
  const problems = useChallengeStore((s) => s.problems);
  const currentIndex = useChallengeStore((s) => s.currentIndex);
  const score = useChallengeStore((s) => s.score);
  const streak = useChallengeStore((s) => s.streak);
  const showingFeedback = useChallengeStore((s) => s.showingFeedback);
  const config = useChallengeStore((s) => s.config);
  const status = useChallengeStore((s) => s.status);
  const timeRemaining = useChallengeStore((s) => s.timeRemaining);
  const answers = useChallengeStore((s) => s.answers);
  const submitAnswer = useChallengeStore((s) => s.submitAnswer);
  const tick = useChallengeStore((s) => s.tick);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const lang = uiLanguage;

  const [selected, setSelected] = useState<string | null>(null);

  const problem = problems[currentIndex];
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  // Timer tick for timed mode (keeps running while reading explanations —
  // reading costs time by design; skip ahead with Next/Enter).
  useEffect(() => {
    if (status !== 'playing' || config.mode !== 'timed') return;
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [status, config.mode, tick]);

  // Manual advance only (issue #12): explanations need reading time, so the
  // old 1.5s auto-advance was removed. Enter / Space / ArrowRight continue.
  useEffect(() => {
    if (!showingFeedback) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'ArrowRight') return;
      // Read fresh state: avoids stale-closure double-advance when the Next
      // button is focused and Enter triggers both keydown and click.
      const s = useChallengeStore.getState();
      if (!s.showingFeedback || s.status !== 'playing') return;
      e.preventDefault();
      s.nextProblem();
      setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showingFeedback]);

  const handleSelect = useCallback((option: string) => {
    if (showingFeedback || !problem) return;
    setSelected(option);
    submitAnswer(problem.test.id, option);
  }, [showingFeedback, problem, submitAnswer]);

  const handleNext = useCallback(() => {
    const s = useChallengeStore.getState();
    if (!s.showingFeedback || s.status !== 'playing') return;
    s.nextProblem();
    setSelected(null);
  }, []);

  if (!problem) return null;

  const questionText = lang === 'zh' ? problem.test.question : (problem.test.question_en || problem.test.question);
  const explanation = lang === 'en'
    ? (problem.test.explanation_en || problem.test.explanation)
    : problem.test.explanation;

  return (
    <div className="challenge-arena">
      <div className="arena-top-bar">
        {config.mode === 'timed' && (
          <ChallengeTimer timeRemaining={timeRemaining} timeLimit={config.timeLimit} />
        )}
        <div className="arena-stats">
          <span className="arena-score">{t('challenge_score', lang)}: {score}</span>
          <StreakIndicator streak={streak} />
          <span className="arena-progress">
            {currentIndex + 1}/{problems.length}
          </span>
        </div>
      </div>

      <div className="arena-problem">
        <div className="arena-question-meta">
          <span className="arena-lang-badge">{problem.test.language_context}</span>
          <span className="arena-difficulty">P{problem.test.difficulty}</span>
          <span className="arena-layer">{problem.concept.layer}</span>
        </div>

        <QuestionText
          text={questionText}
          fallbackLanguage={problem.test.language_context}
          className="arena-question-text"
        />

        <div className="arena-options" role="radiogroup" aria-label="Answer options">
          {problem.test.options.map((option) => {
            let optClass = 'arena-option';
            if (showingFeedback && selected === option) {
              optClass += lastAnswer?.correct ? ' correct' : ' wrong';
            }
            if (showingFeedback && option === problem.test.correct_answer && selected !== option) {
              optClass += ' reveal-correct';
            }
            return (
              <button
                key={option}
                className={optClass}
                onClick={() => handleSelect(option)}
                disabled={showingFeedback}
                aria-pressed={selected === option}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showingFeedback && (
          <div className="arena-feedback" role="alert" aria-live="polite">
            {lastAnswer?.correct ? (
              <div className="feedback-correct">
                <span className="feedback-icon">✓</span>
                <span>{t('feedback_correct_prefix', lang)}{lastAnswer.score}</span>
              </div>
            ) : (
              <div className="feedback-wrong">
                <span className="feedback-icon">✗</span>
                <span>{t('feedback_answer_prefix', lang)}{problem.test.correct_answer}</span>
              </div>
            )}
            <p className="feedback-explanation">
              <span className="explanation-label">{t('explanation_label', lang)}</span>
              {explanation}
            </p>
            {problem.test.trap_note && (
              <p className="feedback-trap-note">{problem.test.trap_note}</p>
            )}
          </div>
        )}

        {showingFeedback && (
          <div className="arena-next-row">
            <button className="btn-primary arena-next" onClick={handleNext}>
              {t('challenge_next', lang)}
            </button>
            <span className="arena-next-hint">{t('challenge_next_hint', lang)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
