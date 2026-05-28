import { useState, useEffect, useCallback } from 'react';
import { useChallengeStore } from '@/store/challengeStore';
import { useUserStore } from '@/store/userStore';
import { ChallengeTimer } from './ChallengeTimer';
import { StreakIndicator } from './StreakIndicator';
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
  const nextProblem = useChallengeStore((s) => s.nextProblem);
  const tick = useChallengeStore((s) => s.tick);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const zh = uiLanguage === 'zh';

  const [selected, setSelected] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const problem = problems[currentIndex];
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  // Timer tick for timed mode
  useEffect(() => {
    if (status !== 'playing' || config.mode !== 'timed') return;
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [status, config.mode, tick]);

  // Auto-advance after feedback
  useEffect(() => {
    if (showingFeedback && !autoAdvance) {
      setAutoAdvance(true);
      const timer = setTimeout(() => {
        nextProblem();
        setSelected(null);
        setAutoAdvance(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showingFeedback, autoAdvance, nextProblem]);

  const handleSelect = useCallback((option: string) => {
    if (showingFeedback || !problem) return;
    setSelected(option);
    submitAnswer(problem.test.id, option);
  }, [showingFeedback, problem, submitAnswer]);

  if (!problem) return null;

  const questionText = zh && problem.test.question_en ? problem.test.question_en : problem.test.question;

  return (
    <div className="challenge-arena">
      <div className="arena-top-bar">
        {config.mode === 'timed' && (
          <ChallengeTimer timeRemaining={timeRemaining} timeLimit={config.timeLimit} />
        )}
        <div className="arena-stats">
          <span className="arena-score">{zh ? '得分' : 'Score'}: {score}</span>
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

        <h3 className="arena-question-text">{questionText}</h3>

        <div className="arena-options">
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
              >
                {option}
              </button>
            );
          })}
        </div>

        {showingFeedback && (
          <div className="arena-feedback">
            {lastAnswer?.correct ? (
              <div className="feedback-correct">
                <span className="feedback-icon">✓</span>
                <span>{zh ? '正确! +' : 'Correct! +'}{lastAnswer.score}</span>
              </div>
            ) : (
              <div className="feedback-wrong">
                <span className="feedback-icon">✗</span>
                <span>{zh ? '正确答案: ' : 'Answer: '}{problem.test.correct_answer}</span>
              </div>
            )}
            {problem.test.trap_note && (
              <p className="feedback-trap-note">{problem.test.trap_note}</p>
            )}
          </div>
        )}

        {showingFeedback && !autoAdvance && (
          <button className="btn-primary arena-next" onClick={() => {
            nextProblem();
            setSelected(null);
            setAutoAdvance(false);
          }}>
            {zh ? '下一题 →' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  );
}