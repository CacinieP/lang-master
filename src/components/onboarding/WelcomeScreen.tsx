import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { LAYER_NAMES, LAYER_ORDER, PARADIGM_LABELS } from '@/data/constants';
import { LanguageSurvey } from './LanguageSurvey';
import './WelcomeScreen.css';

export function WelcomeScreen() {
  const [step, setStep] = useState<'intro' | 'survey' | 'done'>('intro');
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
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
          {uiLanguage === 'zh'
            ? '编程语言也有语法、词汇、语义——就像自然语言一样'
            : 'Programming languages have grammar, vocabulary, semantics — just like natural languages'}
        </p>

        <div className="five-layers-intro">
          <h3 className="layers-title">
            {uiLanguage === 'zh' ? '五层语言学框架' : 'Five-Layer Linguistic Framework'}
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
            {uiLanguage === 'zh'
              ? '每门编程语言都可以从这五层来理解——从关键字拼写（词法层）到社区惯用法（语用层）。Lang Master 帮你分层攻克，而非混沌积累。'
              : 'Every programming language can be understood through these five layers — from keyword spelling (Lexical) to community idioms (Pragmatic). Lang Master helps you conquer them layer by layer.'}
          </p>
        </div>

        <div className="paradigm-intro">
          <h3 className="paradigm-title">
            {uiLanguage === 'zh' ? '三种编程范式' : 'Three Programming Paradigms'}
          </h3>
          <div className="paradigm-cards">
            {(['procedural', 'oop', 'functional'] as const).map((p) => (
              <div key={p} className="paradigm-card">
                <span className="paradigm-card-icon">{PARADIGM_LABELS[p].icon}</span>
                <span className="paradigm-card-name">
                  {uiLanguage === 'zh' ? PARADIGM_LABELS[p].zh : PARADIGM_LABELS[p].en}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="welcome-actions">
          <button className="btn-primary btn-lg" onClick={() => setStep('survey')}>
            {uiLanguage === 'zh' ? '开始探索' : 'Start Exploring'}
          </button>
          <button className="btn-secondary" onClick={handleFinish}>
            {uiLanguage === 'zh' ? '跳过，直接进入' : 'Skip, go directly'}
          </button>
        </div>
      </div>
    </div>
  );
}
