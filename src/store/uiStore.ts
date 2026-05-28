import { create } from 'zustand';
import type { AlphaLanguage } from '@/types';
import { ALPHA_LANGUAGES } from '@/types';
import { shuffle } from '@/utils/shuffle';

type View = 'welcome' | 'explore' | 'challenge';

interface UIState {
  currentView: View;
  sidebarOpen: boolean;
  trapPanelOpen: boolean;
  quizPanelOpen: boolean;
  equivalentsOpen: Record<string, boolean>;
  languageDisplayOrder: AlphaLanguage[];
  selectedLanguages: AlphaLanguage[];

  setCurrentView: (view: View) => void;
  toggleSidebar: () => void;
  toggleTrapPanel: () => void;
  toggleQuizPanel: () => void;
  toggleEquivalents: (conceptId: string) => void;
  shuffleLanguageOrder: () => void;
  setSelectedLanguages: (langs: AlphaLanguage[]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentView: 'welcome',
  sidebarOpen: true,
  trapPanelOpen: true,
  quizPanelOpen: false,
  equivalentsOpen: {},
  languageDisplayOrder: shuffle([...ALPHA_LANGUAGES]),
  selectedLanguages: ALPHA_LANGUAGES.slice(0, 3) as AlphaLanguage[],

  setCurrentView: (view) => set({ currentView: view }),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  toggleTrapPanel: () => set((s) => ({ trapPanelOpen: !s.trapPanelOpen })),

  toggleQuizPanel: () => set((s) => ({ quizPanelOpen: !s.quizPanelOpen })),

  toggleEquivalents: (conceptId) =>
    set((s) => ({
      equivalentsOpen: { ...s.equivalentsOpen, [conceptId]: !s.equivalentsOpen[conceptId] },
    })),

  shuffleLanguageOrder: () =>
    set({ languageDisplayOrder: shuffle([...ALPHA_LANGUAGES]) }),

  setSelectedLanguages: (langs) => set({ selectedLanguages: langs }),
}));
