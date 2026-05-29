import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { LAYER_NAMES, LAYER_ORDER, PARADIGM_LABELS } from '@/data/constants';
import { LanguageSurvey } from './LanguageSurvey';
import { t } from '@/utils/i18n';
import './WelcomeScreen.css';

export function WelcomeScreen() {
  const [step, setStep] = useState<'intro' | 'survey' | 'done'>('intro');
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const lang = uiLanguage;
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const setCurrentView = useUIStore((s) => s.setCurrentView);

  const handleFinish = () => {
    completeOnboarding();
    setCurrentView('explore');
  };

  if (step === 'survey') {
    return <LanguageSurvey onComplete={handleFinish} />;
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1 className="welcome-title">Lang Master</h1>
        <p className="welcome-subtitle">
          {t('welcome_subtitle', lang)}
        </p>

        <div className="five-layers-intro">
          <h3 className="layers-title">
            {t('five_layer_framework', lang)}
          </h3>
          <div className="layers-diagram">
            {LAYER_ORDER.map((layer, i) => (
              <div key={layer} className="layer-step">
                <div className="layer-step-number">{i + 1}</div>
                <div className="layer-step-content">
                  <div className="layer-step-name">
                    {LAYER_NAMES[layer][uiLanguage]}
                  </div>
                  <div className="layer-step-english">{LAYER_NAMES[layer].en}</div>
                </div>
                {i < LAYER_ORDER.length - 1 && <div className="layer-arrow">→</div>}
              </div>
            ))}
          </div>
          <p className="layers-explanation">
            {t('layers_explanation', lang)}
          </p>
        </div>

        <div className="paradigm-intro">
          <h3 className="paradigm-title">
            {t('three_paradigms', lang)}
          </h3>
          <div className="paradigm-cards">
            {(['procedural', 'oop', 'functional'] as const).map((p) => (
              <div key={p} className="paradigm-card">
                <span className="paradigm-card-icon">{PARADIGM_LABELS[p].icon}</span>
                <span className="paradigm-card-name">
                  {lang === 'zh' ? PARADIGM_LABELS[p].zh : PARADIGM_LABELS[p].en}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="welcome-actions">
          <button className="btn-primary btn-lg" onClick={() => setStep('survey')}>
            {t('start_exploring', lang)}
          </button>
          <button className="btn-secondary" onClick={handleFinish}>
            {t('skip_go_directly', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
