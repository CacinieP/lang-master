import { create } from 'zustand';
import type { UserProfile, AlphaLanguage, Proficiency } from '@/types';
import { defaultProfile } from '@/types';
import { loadProfile, saveProfile } from '@/services/storage';

interface UserState {
  profile: UserProfile;
  isOnboarded: boolean;

  load: () => void;
  addKnownLanguage: (lang: AlphaLanguage, proficiency: Proficiency) => void;
  removeKnownLanguage: (lang: AlphaLanguage) => void;
  completeOnboarding: () => void;
  setFocusLanguage: (lang: AlphaLanguage | null) => void;
  setUILanguage: (lang: 'zh' | 'en') => void;
  setDarkMode: (dark: boolean) => void;
  getKnownLanguageCodes: () => AlphaLanguage[];
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: defaultProfile(),
  isOnboarded: false,

  load: () => {
    const profile = loadProfile();
    set({
      profile,
      isOnboarded: profile.known_languages.length > 0 || profile.last_accessed > profile.created_at + 60000,
    });
  },

  addKnownLanguage: (lang, proficiency) => {
    const { profile } = get();
    const existing = profile.known_languages.findIndex((l) => l.language === lang);
    const updated = { ...profile };
    if (existing >= 0) {
      updated.known_languages = [...updated.known_languages];
      updated.known_languages[existing] = { language: lang, proficiency, self_assessed: true };
    } else {
      updated.known_languages = [...updated.known_languages, { language: lang, proficiency, self_assessed: true }];
    }
    updated.last_accessed = Date.now();
    saveProfile(updated);
    set({ profile: updated });
  },

  removeKnownLanguage: (lang) => {
    const { profile } = get();
    const updated = {
      ...profile,
      known_languages: profile.known_languages.filter((l) => l.language !== lang),
      last_accessed: Date.now(),
    };
    saveProfile(updated);
    set({ profile: updated });
  },

  completeOnboarding: () => {
    const { profile } = get();
    const updated = { ...profile, last_accessed: Date.now() };
    saveProfile(updated);
    set({ profile: updated, isOnboarded: true });
  },

  setFocusLanguage: (lang) => {
    const { profile } = get();
    const updated = { ...profile, current_focus_language: lang, last_accessed: Date.now() };
    saveProfile(updated);
    set({ profile: updated });
  },

  setUILanguage: (lang) => {
    const { profile } = get();
    const updated = { ...profile, ui_language: lang, last_accessed: Date.now() };
    saveProfile(updated);
    set({ profile: updated });
  },

  setDarkMode: (dark) => {
    const { profile } = get();
    const updated = {
      ...profile,
      settings: { ...profile.settings, dark_mode: dark },
      last_accessed: Date.now(),
    };
    saveProfile(updated);
    set({ profile: updated });
  },

  getKnownLanguageCodes: () => {
    return get().profile.known_languages.map((l) => l.language);
  },
}));
