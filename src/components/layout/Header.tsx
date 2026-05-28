import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { t } from '@/utils/i18n';

export function Header() {
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const darkMode = useUserStore((s) => s.profile.settings.dark_mode);
  const setDarkMode = useUserStore((s) => s.setDarkMode);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setCurrentView = useUIStore((s) => s.setCurrentView);

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="btn-icon" onClick={toggleSidebar} title="Toggle sidebar">
          ☰
        </button>
        <h1 className="header-title">{t('app_title', uiLanguage)}</h1>
        <span className="header-subtitle">{t('app_subtitle', uiLanguage)}</span>
      </div>
      <div className="header-right">
        <button
          className="btn-challenge"
          onClick={() => setCurrentView('challenge')}
          title="Challenge"
        >
          ⚔
        </button>
        <button
          className="btn-icon"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? '☀' : '☾'}
        </button>
      </div>
    </header>
  );
}
