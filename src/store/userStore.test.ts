import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserStore } from './userStore';
import { useUIStore } from './uiStore';
import { defaultProfile } from '@/types';

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, String(v));
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => store.clear(),
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createLocalStorageMock());
  useUserStore.setState({ profile: defaultProfile(), isOnboarded: false });
  useUIStore.setState({ currentView: 'welcome', toasts: [] });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('userStore known languages', () => {
  it('adds a language with self-assessed proficiency', () => {
    useUserStore.getState().addKnownLanguage('python', 'intermediate');
    const langs = useUserStore.getState().profile.known_languages;
    expect(langs).toEqual([{ language: 'python', proficiency: 'intermediate', self_assessed: true }]);
    expect(useUserStore.getState().getKnownLanguageCodes()).toEqual(['python']);
  });

  it('updates proficiency in place instead of duplicating', () => {
    useUserStore.getState().addKnownLanguage('python', 'beginner');
    useUserStore.getState().addKnownLanguage('python', 'expert');
    const langs = useUserStore.getState().profile.known_languages;
    expect(langs).toHaveLength(1);
    expect(langs[0].proficiency).toBe('expert');
  });

  it('removes a language', () => {
    useUserStore.getState().addKnownLanguage('python', 'beginner');
    useUserStore.getState().addKnownLanguage('rust', 'beginner');
    useUserStore.getState().removeKnownLanguage('python');
    expect(useUserStore.getState().getKnownLanguageCodes()).toEqual(['rust']);
  });

  it('persists changes to localStorage', () => {
    useUserStore.getState().addKnownLanguage('java', 'advanced');
    const stored = JSON.parse(localStorage.getItem('langmaster_profile')!);
    expect(stored.known_languages[0].language).toBe('java');
  });
});

describe('userStore onboarding & settings', () => {
  it('load restores a persisted profile', () => {
    localStorage.setItem(
      'langmaster_profile',
      JSON.stringify({ ...defaultProfile(), onboarding_completed: true, ui_language: 'en' }),
    );
    useUserStore.getState().load();
    expect(useUserStore.getState().isOnboarded).toBe(true);
    expect(useUserStore.getState().profile.ui_language).toBe('en');
  });

  it('completeOnboarding flips the flag and persists', () => {
    useUserStore.getState().completeOnboarding();
    expect(useUserStore.getState().isOnboarded).toBe(true);
    expect(JSON.parse(localStorage.getItem('langmaster_profile')!).onboarding_completed).toBe(true);
  });

  it('resetOnboarding returns to the welcome view', () => {
    useUserStore.getState().completeOnboarding();
    useUserStore.getState().resetOnboarding();
    expect(useUserStore.getState().isOnboarded).toBe(false);
    expect(useUIStore.getState().currentView).toBe('welcome');
  });

  it('setUILanguage and setDarkMode update the profile', () => {
    useUserStore.getState().setUILanguage('en');
    useUserStore.getState().setDarkMode(true);
    const p = useUserStore.getState().profile;
    expect(p.ui_language).toBe('en');
    expect(p.settings.dark_mode).toBe(true);
  });

  it('setFocusLanguage accepts null to clear focus', () => {
    useUserStore.getState().setFocusLanguage('rust');
    expect(useUserStore.getState().profile.current_focus_language).toBe('rust');
    useUserStore.getState().setFocusLanguage(null);
    expect(useUserStore.getState().profile.current_focus_language).toBeNull();
  });
});
