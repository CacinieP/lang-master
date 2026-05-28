import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';
import { LAYER_ORDER, LAYER_NAMES } from '@/data/constants';
import { t } from '@/utils/i18n';
import './LayerNavigator.css';

export function LayerNavigator() {
  const layerProgress = useProgressStore((s) => s.layerProgress);
  const totalPerLayer = useProgressStore((s) => s.totalPerLayer);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);

  return (
    <div className="layer-navigator">
      <div className="layer-nav-title">
        {uiLanguage === 'zh' ? '五层进度' : 'Layer Progress'}
      </div>
      {LAYER_ORDER.map((layer) => {
        const names = LAYER_NAMES[layer];
        const pct = Math.round((layerProgress[layer] ?? 0) * 100);
        const total = totalPerLayer[layer] ?? 0;
        const isBeta = total === 0;

        return (
          <div key={layer} className={`layer-segment ${isBeta ? 'beta' : ''}`}>
            <div className="layer-label">
              <span className="layer-short">{names.short}</span>
              <span className="layer-name">{names[uiLanguage]}</span>
              {isBeta && <span className="beta-tag">{t('beta_label', uiLanguage)}</span>}
            </div>
            <div className="layer-bar">
              <div
                className="layer-bar-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="layer-pct">{isBeta ? '—' : `${pct}%`}</span>
          </div>
        );
      })}
    </div>
  );
}
