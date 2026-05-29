import { useState, useEffect } from 'react';
import { useChallengeStore } from '@/store/challengeStore';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { countAvailableProblems } from '@/services/challengeEngine';
import { LAYER_NAMES, LAYER_ORDER } from '@/data/constants';
import { t } from '@/utils/i18n';
import type { Layer } from '@/types';
import './Challenge.css';

export function ChallengeLobby() {
  const config = useChallengeStore((s) => s.config);
  const setConfig = useChallengeStore((s) => s.setConfig);
  const startChallenge = useChallengeStore((s) => s.startChallenge);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const setCurrentView = useUIStore((s) => s.setCurrentView);
  const [available, setAvailable] = useState(0);

  useEffect(() => {
    setAvailable(countAvailableProblems(config));
  }, [config]);

  const toggleLayer = (layer: Layer) => {
    const layers = config.layers.includes(layer)
      ? config.layers.filter((l) => l !== layer)
      : [...config.layers, layer];
    if (layers.length > 0) setConfig({ layers: layers as Layer[] });
  };

  const handleStart = () => {
    startChallenge();
    if (available === 0) {
      useUIStore.getState().addToast(
        t('no_problems', lang),
        'warning',
      );
    }
  };

  const lang = uiLanguage;

  return (
    <div className="challenge-lobby">
      <div className="lobby-card">
        <h2 className="lobby-title">{t('challenge_mode_subtitle', lang)}</h2>
        <p className="lobby-subtitle">
          {t('lobby_subtitle', lang)}
        </p>

        <div className="lobby-section">
          <h3 className="lobby-section-title">{t('lobby_mode', lang)}</h3>
          <div className="mode-buttons">
            <button
              className={`mode-btn ${config.mode === 'timed' ? 'active' : ''}`}
              onClick={() => setConfig({ mode: 'timed' })}
            >
              <span className="mode-icon">⏱</span>
              <span>{t('timed_mode', lang)}</span>
            </button>
            <button
              className={`mode-btn ${config.mode === 'count' ? 'active' : ''}`}
              onClick={() => setConfig({ mode: 'count' })}
            >
              <span className="mode-icon">🎯</span>
              <span>{t('count_mode', lang)}</span>
            </button>
          </div>
        </div>

        {config.mode === 'timed' && (
          <div className="lobby-section">
            <h3 className="lobby-section-title">{t('lobby_time', lang)}</h3>
            <div className="time-buttons">
              {[60, 180, 300, 600].map((sec) => (
                <button
                  key={sec}
                  className={`time-btn ${config.timeLimit === sec ? 'active' : ''}`}
                  onClick={() => setConfig({ timeLimit: sec })}
                >
                  {sec >= 60 ? `${sec / 60}${t('minutes_unit', lang)}` : `${sec}s`}
                </button>
              ))}
            </div>
          </div>
        )}

        {config.mode === 'count' && (
          <div className="lobby-section">
            <h3 className="lobby-section-title">{t('lobby_questions', lang)}</h3>
            <div className="time-buttons">
              {[10, 20, 30, 50].map((n) => (
                <button
                  key={n}
                  className={`time-btn ${config.questionCount === n ? 'active' : ''}`}
                  onClick={() => setConfig({ questionCount: n })}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="lobby-section">
          <h3 className="lobby-section-title">{t('lobby_layers', lang)}</h3>
          <div className="layer-buttons">
            {LAYER_ORDER.slice(0, 3).map((layer) => (
              <button
                key={layer}
                className={`layer-btn ${config.layers.includes(layer) ? 'active' : ''}`}
                onClick={() => toggleLayer(layer)}
              >
                <span className="layer-btn-short">{LAYER_NAMES[layer].short}</span>
                <span className="layer-btn-name">{LAYER_NAMES[layer][uiLanguage]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lobby-info">
          <span className="info-badge">{available} {lang === 'zh' ? '题可用' : 'questions'}</span>
          <span className="info-badge">{t('four_languages', lang)}</span>
        </div>

        <div className="lobby-actions">
          <button className="btn-primary btn-lg lobby-start" onClick={handleStart} disabled={available === 0}>
            {t('challenge_start', lang)}
          </button>
          <button className="btn-secondary" onClick={() => setCurrentView('explore')}>
            {t('back_to_explore', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
