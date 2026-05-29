import { useChallengeStore } from '@/store/challengeStore';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { t } from '@/utils/i18n';
import './Challenge.css';

export function ChallengeResult() {
  const score = useChallengeStore((s) => s.score);
  const answers = useChallengeStore((s) => s.answers);
  const maxStreak = useChallengeStore((s) => s.maxStreak);
  const problems = useChallengeStore((s) => s.problems);
  const resetChallenge = useChallengeStore((s) => s.resetChallenge);
  const startChallenge = useChallengeStore((s) => s.startChallenge);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const setCurrentView = useUIStore((s) => s.setCurrentView);
  const lang = uiLanguage;

  const correctCount = answers.filter((a) => a.correct).length;
  const totalQuestions = answers.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const handlePlayAgain = () => {
    resetChallenge();
    startChallenge();
  };

  const handleBackToExplore = () => {
    resetChallenge();
    setCurrentView('explore');
  };

  const handleBackToLobby = () => {
    resetChallenge();
  };

  return (
    <div className="challenge-result">
      <div className="result-card">
        <h2 className="result-title">{t('challenge_result_title_alt', lang)}</h2>

        <div className="result-stats-grid">
          <div className="result-stat-block">
            <span className="stat-value">{score}</span>
            <span className="stat-label">{t('result_total_score', lang)}</span>
          </div>
          <div className="result-stat-block">
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-label">{t('result_accuracy_label', lang)}</span>
          </div>
          <div className="result-stat-block">
            <span className="stat-value">{correctCount}/{totalQuestions}</span>
            <span className="stat-label">{t('result_correct_label', lang)}</span>
          </div>
          <div className="result-stat-block">
            <span className="stat-value">×{maxStreak}</span>
            <span className="stat-label">{t('result_max_streak_label', lang)}</span>
          </div>
        </div>

        <div className="result-detail">
          <h3 className="detail-title">{t('question_review', lang)}</h3>
          {answers.map((answer, i) => {
            const problem = problems[i];
            return (
              <div key={answer.testId} className={`review-item ${answer.correct ? 'review-correct' : 'review-wrong'}`}>
                <div className="review-header">
                  <span className="review-num">#{i + 1}</span>
                  <span className="review-lang">{problem?.test.language_context}</span>
                  <span className={`review-result ${answer.correct ? 'correct' : 'wrong'}`}>
                    {answer.correct ? '✓' : '✗'}
                  </span>
                  <span className="review-score">+{answer.score}</span>
                </div>
                {!answer.correct && (
                  <div className="review-answer-detail">
                    <span className="review-your-answer">{t('your_answer', lang)}{answer.selected}</span>
                    <span className="review-correct-answer">{t('correct_answer', lang)}{problem?.test.correct_answer}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="result-actions">
          <button className="btn-primary btn-lg" onClick={handlePlayAgain}>
            {t('play_again', lang)}
          </button>
          <button className="btn-secondary" onClick={handleBackToLobby}>
            {t('back_to_lobby', lang)}
          </button>
          <button className="btn-secondary" onClick={handleBackToExplore}>
            {t('back_to_explore', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}