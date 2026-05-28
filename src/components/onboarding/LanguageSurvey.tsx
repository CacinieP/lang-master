import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { ALPHA_LANGUAGES } from '@/types';
import { LANGUAGE_META } from '@/data/constants';

interface Props {
  onComplete: () => void;
}

export function LanguageSurvey({ onComplete }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const addKnownLanguage = useUserStore((s) => s.addKnownLanguage);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);

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
      addKnownLanguage(lang as typeof ALPHA_LANGUAGES[number], 'intermediate');
    }
    onComplete();
  };

  return (
    <div className="language-survey">
      <h2 className="survey-title">
        {uiLanguage === 'zh' ? '你熟悉哪些编程语言？' : 'Which programming languages do you know?'}
      </h2>
      <p className="survey-subtitle">
        {uiLanguage === 'zh'
          ? '这将帮助 Lang Master 为你标注负迁移陷阱和正迁移加速路径'
          : 'This helps Lang Master label negative transfer traps and positive transfer paths for you'}
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
          {uiLanguage === 'zh' ? '继续' : 'Continue'}
        </button>
        <button className="btn-secondary" onClick={onComplete}>
          {uiLanguage === 'zh' ? '跳过' : 'Skip'}
        </button>
      </div>
    </div>
  );
}
