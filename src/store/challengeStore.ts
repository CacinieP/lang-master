import { create } from 'zustand';
import type { ChallengeConfig, ChallengeProblem } from '@/services/challengeEngine';
import { DEFAULT_CONFIG, assembleProblems, calculateScore } from '@/services/challengeEngine';
import { loadChallengeStats, saveChallengeStats } from '@/services/storage';
import type { ChallengeStats } from '@/types';
import { useProgressStore } from './progressStore';
import { useUIStore } from './uiStore';
import { useUserStore } from './userStore';
import { t } from '@/utils/i18n';

export type ChallengeStatus = 'idle' | 'playing' | 'finished';

export interface Answer {
  testId: string;
  selected: string;
  correct: boolean;
  timeMs: number;
  score: number;
}

interface ChallengeState {
  config: ChallengeConfig;
  problems: ChallengeProblem[];
  currentIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  answers: Answer[];
  startedAt: number;
  problemStartedAt: number;
  timeRemaining: number; // seconds
  status: ChallengeStatus;
  showingFeedback: boolean;
  stats: ChallengeStats;
  isNewRecord: boolean;

  setConfig: (config: Partial<ChallengeConfig>) => void;
  startChallenge: () => void;
  submitAnswer: (testId: string, selected: string) => void;
  nextProblem: () => void;
  tick: () => void;
  finishChallenge: () => void;
  resetChallenge: () => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  config: { ...DEFAULT_CONFIG },
  problems: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  answers: [],
  startedAt: 0,
  problemStartedAt: 0,
  timeRemaining: 0,
  status: 'idle',
  showingFeedback: false,
  stats: loadChallengeStats(),
  isNewRecord: false,

  setConfig: (partial) =>
    set((s) => ({ config: { ...s.config, ...partial } })),

  startChallenge: () => {
    const { config } = get();
    const problems = assembleProblems(config);
    if (problems.length === 0) return;
    set({
      problems,
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: [],
      startedAt: Date.now(),
      problemStartedAt: Date.now(),
      timeRemaining: config.mode === 'timed' ? config.timeLimit : 0,
      status: 'playing',
      showingFeedback: false,
      isNewRecord: false,
    });
  },

  submitAnswer: (testId, selected) => {
    const state = get();
    // Guard at the state layer: UI closures can race (fast double-click submits
    // twice before re-render), and stale callbacks may fire after time expires.
    if (state.status !== 'playing' || state.showingFeedback) return;
    const { problems, currentIndex, streak, maxStreak, score, config, timeRemaining, answers } = state;
    const problem = problems[currentIndex];
    if (!problem) return;

    const correct = selected === problem.test.correct_answer;
    const timeMs = Date.now() - state.problemStartedAt;
    const newStreak = correct ? streak + 1 : 0;
    const newMaxStreak = Math.max(maxStreak, newStreak);
    const points = calculateScore(
      correct,
      problem.test.difficulty,
      newStreak,
      config.mode === 'timed' ? timeRemaining : undefined,
      config.mode === 'timed' ? config.timeLimit : undefined,
    );

    const answer: Answer = { testId, selected, correct, timeMs, score: points };
    // Challenge practice feeds the same mastery system as explore mode (issue #17).
    useProgressStore.getState().recordQuizResult(problem.concept.id, problem.concept.layer, correct);
    set({
      answers: [...answers, answer],
      score: score + points,
      streak: newStreak,
      maxStreak: newMaxStreak,
      showingFeedback: true,
    });
  },

  nextProblem: () => {
    const { currentIndex, problems, status } = get();
    if (status !== 'playing') return;
    const nextIdx = currentIndex + 1;
    if (nextIdx >= problems.length) {
      get().finishChallenge();
    } else {
      set({ currentIndex: nextIdx, showingFeedback: false, problemStartedAt: Date.now() });
    }
  },

  tick: () => {
    const { timeRemaining, status } = get();
    if (status !== 'playing') return;
    const next = timeRemaining - 1;
    if (next <= 0) {
      set({ timeRemaining: 0 });
      get().finishChallenge();
    } else {
      set({ timeRemaining: next });
    }
  },

  finishChallenge: () => {
    const state = get();
    // Only settle a live run: guards finished (idempotent) AND idle/reset
    // states so a stale callback can never record an empty game (issue #28).
    if (state.status !== 'playing') return;
    const { answers, score, config, stats } = state;
    const total = answers.length;
    const correct = answers.filter((a) => a.correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const isNewRecord = score > stats.bestScore && score > 0;
    const nextStats: ChallengeStats = {
      bestScore: Math.max(stats.bestScore, score),
      gamesPlayed: stats.gamesPlayed + 1,
      totalCorrect: stats.totalCorrect + correct,
      totalAnswered: stats.totalAnswered + total,
      history: [
        { score, accuracy, correct, total, mode: config.mode, playedAt: Date.now() },
        ...stats.history,
      ].slice(0, 10),
    };
    saveChallengeStats(nextStats) || useUIStore.getState().addToast(
      t('save_failed', useUserStore.getState().profile.ui_language),
      'error',
    );
    set({ status: 'finished', stats: nextStats, isNewRecord });
  },

  resetChallenge: () => {
    set({
      problems: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: [],
      startedAt: 0,
      problemStartedAt: 0,
      timeRemaining: 0,
      status: 'idle',
      showingFeedback: false,
      isNewRecord: false,
    });
  },
}));
