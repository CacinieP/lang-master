import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { t } from '@/utils/i18n';

export function Header() {
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const setUILanguage = useUserStore((s) => s.setUILanguage);
  const darkMode = useUserStore((s) => s.profile.settings.dark_mode);
  const setDarkMode = useUserStore((s) => s.setDarkMode);
  const resetOnboarding = useUserStore((s) => s.resetOnboarding);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setCurrentView = useUIStore((s) => s.setCurrentView);

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="btn-icon" onClick={toggleSidebar} aria-label={t('toggle_sidebar', uiLanguage)}>
          ☰
        </button>
        <h1
          className="header-title"
          onDoubleClick={resetOnboarding}
          title={t('reset_onboarding_hint', uiLanguage)}
        >
          {t('app_title', uiLanguage)}
        </h1>
        <span className="header-subtitle">{t('app_subtitle', uiLanguage)}</span>
      </div>
      <nav className="header-right" aria-label="Header actions">
        <button
          className="btn-challenge"
          onClick={() => setCurrentView('challenge')}
          aria-label={t('challenge_btn', uiLanguage)}
        >
          ⚔ <span className="challenge-label">{t('challenge_btn', uiLanguage)}</span>
        </button>
        <button
          className="btn-icon"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={t('dark_mode', uiLanguage)}
        >
          {darkMode ? '☀' : '☾'}
        </button>
        <button
          className="btn-icon"
          onClick={() => setUILanguage(uiLanguage === 'zh' ? 'en' : 'zh')}
          aria-label={t('switch_lang', uiLanguage)}
          title={uiLanguage === 'zh' ? 'Switch to English' : '切换到中文'}
        >
          {t('switch_lang', uiLanguage)}
        </button>
      </nav>
    </header>
  );
}
