import type { ConceptNode } from '@/types';
import { useUserStore } from '@/store/userStore';
import { LAYER_NAMES } from '@/data/constants';
import { ParadigmView } from './ParadigmView';
import { TrapAdvisor } from '../trap/TrapAdvisor';
import { SemanticQuiz } from '../practice/SemanticQuiz';
import { useUIStore } from '@/store/uiStore';
import { t } from '@/utils/i18n';
import './ConceptView.css';

interface Props {
  concept: ConceptNode;
}

export function ConceptView({ concept }: Props) {
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const lang = uiLanguage;
  const trapPanelOpen = useUIStore((s) => s.trapPanelOpen);
  const quizPanelOpen = useUIStore((s) => s.quizPanelOpen);
  const toggleTrapPanel = useUIStore((s) => s.toggleTrapPanel);
  const toggleQuizPanel = useUIStore((s) => s.toggleQuizPanel);

  const layerName = LAYER_NAMES[concept.layer];

  return (
    <div className="concept-view">
      <div className="concept-header">
        <div className="concept-badges">
          <span className="badge badge-layer">{layerName.short} {layerName[lang]}</span>
          <span className="badge badge-difficulty">P{concept.difficulty}</span>
        </div>
        <h2 className="concept-title">
          {uiLanguage === 'zh' ? concept.name : concept.name_en}
        </h2>
        <p className="concept-description">
          {uiLanguage === 'zh' ? concept.description : concept.description_en}
        </p>
      </div>

      <ParadigmView concept={concept} />

      <div className="concept-panels">
        <div className="panel-toggle-row">
          <button
            className={`panel-toggle ${trapPanelOpen ? 'active' : ''}`}
            onClick={toggleTrapPanel}
          >
            ⚠ {t('traps_title', lang)}
          </button>
          <button
            className={`panel-toggle ${quizPanelOpen ? 'active' : ''}`}
            onClick={toggleQuizPanel}
          >
            ✓ {t('quiz_title', lang)}
          </button>
        </div>

        {trapPanelOpen && <TrapAdvisor concept={concept} />}

        {quizPanelOpen && <SemanticQuiz concept={concept} />}
      </div>
    </div>
  );
}
