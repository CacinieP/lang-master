import { create } from 'zustand';
import type { UserProfile, AlphaLanguage, Proficiency } from '@/types';
import { defaultProfile } from '@/types';
import { loadProfile, saveProfile } from '@/services/storage';
import { useUIStore } from './uiStore';

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
  resetOnboarding: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: defaultProfile(),
  isOnboarded: false,

  load: () => {
    const profile = loadProfile();
    set({
      profile,
      isOnboarded: profile.onboarding_completed,
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
    saveProfile(updated) || useUIStore.getState().addToast('保存失败，请检查浏览器存储空间', 'error');
    set({ profile: updated });
  },

  removeKnownLanguage: (lang) => {
    const { profile } = get();
    const updated = {
      ...profile,
      known_languages: profile.known_languages.filter((l) => l.language !== lang),
      last_accessed: Date.now(),
    };
    saveProfile(updated) || useUIStore.getState().addToast('保存失败，请检查浏览器存储空间', 'error');
    set({ profile: updated });
  },

  completeOnboarding: () => {
    const { profile } = get();
    const updated = { ...profile, last_accessed: Date.now(), onboarding_completed: true };
    saveProfile(updated) || useUIStore.getState().addToast('保存失败，请检查浏览器存储空间', 'error');
    set({ profile: updated, isOnboarded: true });
  },

  setFocusLanguage: (lang) => {
    const { profile } = get();
    const updated = { ...profile, current_focus_language: lang, last_accessed: Date.now() };
    saveProfile(updated) || useUIStore.getState().addToast('保存失败，请检查浏览器存储空间', 'error');
    set({ profile: updated });
  },

  setUILanguage: (lang) => {
    const { profile } = get();
    const updated = { ...profile, ui_language: lang, last_accessed: Date.now() };
    saveProfile(updated) || useUIStore.getState().addToast('保存失败，请检查浏览器存储空间', 'error');
    set({ profile: updated });
  },

  setDarkMode: (dark) => {
    const { profile } = get();
    const updated = {
      ...profile,
      settings: { ...profile.settings, dark_mode: dark },
      last_accessed: Date.now(),
    };
    saveProfile(updated) || useUIStore.getState().addToast('保存失败，请检查浏览器存储空间', 'error');
    set({ profile: updated });
  },

  getKnownLanguageCodes: () => {
    return get().profile.known_languages.map((l) => l.language);
  },

  resetOnboarding: () => {
    const { profile } = get();
    const updated = { ...profile, onboarding_completed: false };
    saveProfile(updated) || useUIStore.getState().addToast('保存失败，请检查浏览器存储空间', 'error');
    set({ profile: updated, isOnboarded: false });
    useUIStore.getState().setCurrentView('welcome');
  },
}));
