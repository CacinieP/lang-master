import { useState, useEffect } from 'react';
import { useChallengeStore } from '@/store/challengeStore';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import { countAvailableProblems } from '@/services/challengeEngine';
import { LAYER_NAMES, LAYER_ORDER } from '@/data/constants';
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
  };

  const zh = uiLanguage === 'zh';

  return (
    <div className="challenge-lobby">
      <div className="lobby-card">
        <h2 className="lobby-title">{zh ? '挑战模式' : 'Challenge Mode'}</h2>
        <p className="lobby-subtitle">
          {zh ? '限时答题，跨语言对比，连续答对获得连击加分' : 'Timed quiz, cross-language comparison, streak bonuses'}
        </p>

        <div className="lobby-section">
          <h3 className="lobby-section-title">{zh ? '模式' : 'Mode'}</h3>
          <div className="mode-buttons">
            <button
              className={`mode-btn ${config.mode === 'timed' ? 'active' : ''}`}
              onClick={() => setConfig({ mode: 'timed' })}
            >
              <span className="mode-icon">⏱</span>
              <span>{zh ? '限时模式' : 'Timed'}</span>
            </button>
            <button
              className={`mode-btn ${config.mode === 'count' ? 'active' : ''}`}
              onClick={() => setConfig({ mode: 'count' })}
            >
              <span className="mode-icon">🎯</span>
              <span>{zh ? '限量模式' : 'Count'}</span>
            </button>
          </div>
        </div>

        {config.mode === 'timed' && (
          <div className="lobby-section">
            <h3 className="lobby-section-title">{zh ? '时间' : 'Time'}</h3>
            <div className="time-buttons">
              {[60, 180, 300, 600].map((t) => (
                <button
                  key={t}
                  className={`time-btn ${config.timeLimit === t ? 'active' : ''}`}
                  onClick={() => setConfig({ timeLimit: t })}
                >
                  {t >= 60 ? `${t / 60}${zh ? '分钟' : 'min'}` : `${t}s`}
                </button>
              ))}
            </div>
          </div>
        )}

        {config.mode === 'count' && (
          <div className="lobby-section">
            <h3 className="lobby-section-title">{zh ? '题数' : 'Questions'}</h3>
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
          <h3 className="lobby-section-title">{zh ? '层级' : 'Layers'}</h3>
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
          <span className="info-badge">{zh ? `${available} 题可用` : `${available} questions`}</span>
          <span className="info-badge">{zh ? '4 语言' : '4 languages'}</span>
        </div>

        <div className="lobby-actions">
          <button className="btn-primary btn-lg lobby-start" onClick={handleStart}>
            {zh ? '开始挑战' : 'Start Challenge'}
          </button>
          <button className="btn-secondary" onClick={() => setCurrentView('explore')}>
            {zh ? '返回探索' : 'Back to Explore'}
          </button>
        </div>
      </div>
    </div>
  );
}
