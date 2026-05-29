import { create } from 'zustand';
import type { ChallengeConfig, ChallengeProblem } from '@/services/challengeEngine';
import { DEFAULT_CONFIG, assembleProblems, calculateScore } from '@/services/challengeEngine';

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
  timeRemaining: number; // seconds
  status: ChallengeStatus;
  showingFeedback: boolean;

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
  timeRemaining: 0,
  status: 'idle',
  showingFeedback: false,

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
      timeRemaining: config.mode === 'timed' ? config.timeLimit : 0,
      status: 'playing',
      showingFeedback: false,
    });
  },

  submitAnswer: (testId, selected) => {
    const state = get();
    const { problems, currentIndex, streak, maxStreak, score, config, timeRemaining, answers } = state;
    const problem = problems[currentIndex];
    if (!problem) return;

    const correct = selected === problem.test.correct_answer;
    const timeMs = Date.now() - state.startedAt;
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
    set({
      answers: [...answers, answer],
      score: score + points,
      streak: newStreak,
      maxStreak: newMaxStreak,
      showingFeedback: true,
    });
  },

  nextProblem: () => {
    const { currentIndex, problems } = get();
    const nextIdx = currentIndex + 1;
    if (nextIdx >= problems.length) {
      get().finishChallenge();
    } else {
      set({ currentIndex: nextIdx, showingFeedback: false });
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
    set({ status: 'finished' });
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
      timeRemaining: 0,
      status: 'idle',
      showingFeedback: false,
    });
  },
}));
