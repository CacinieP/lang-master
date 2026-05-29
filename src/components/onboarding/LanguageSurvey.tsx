import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { ALPHA_LANGUAGES } from '@/types';
import { LANGUAGE_META } from '@/data/constants';
import { t } from '@/utils/i18n';

interface Props {
  onComplete: () => void;
}

export function LanguageSurvey({ onComplete }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const addKnownLanguage = useUserStore((s) => s.addKnownLanguage);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const lang = uiLanguage;

  const toggleLang = (lang: string) => {
    const next = new Set(selected);
    if (next.has(lang)) {
      next.delete(lang);
    } else {
      next.add(lang);
    }
    setSelected(next);
  };

  const handleContinue = () => {
    for (const lang of selected) {
      addKnownLanguage(lang as typeof ALPHA_LANGUAGES[number], 'beginner');
    }
    onComplete();
  };

  return (
    <div className="language-survey">
      <h2 className="survey-title">
        {t('survey_title', lang)}
      </h2>
      <p className="survey-subtitle">
        {t('survey_subtitle', lang)}
      </p>

      <div className="survey-languages">
        {ALPHA_LANGUAGES.map((lang) => {
          const meta = LANGUAGE_META[lang];
          const isSelected = selected.has(lang);
          return (
            <button
              key={lang}
              className={`survey-lang-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleLang(lang)}
            >
              <span className="survey-lang-icon">{meta.icon}</span>
              <span className="survey-lang-name">{meta.name}</span>
            </button>
          );
        })}
      </div>

      <div className="survey-actions">
        <button className="btn-primary btn-lg" onClick={handleContinue}>
          {t('survey_continue', lang)}
        </button>
        <button className="btn-secondary" onClick={onComplete}>
          {t('survey_skip', lang)}
        </button>
      </div>
    </div>
  );
}
