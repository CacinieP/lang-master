import type { AlphaLanguage, LanguageExpression } from '@/types';
import { LANGUAGE_META } from '@/data/constants';
import { CodeBlock } from './CodeBlock';
import { useUIStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';
import { t } from '@/utils/i18n';
import './ExpressionCard.css';

interface Props {
  language: AlphaLanguage;
  expression: LanguageExpression;
  conceptId: string;
}

export function ExpressionCard({ language, expression, conceptId }: Props) {
  const meta = LANGUAGE_META[language];
  const equivalentsOpen = useUIStore((s) => s.equivalentsOpen[conceptId]);
  const toggleEquivalents = useUIStore((s) => s.toggleEquivalents);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);
  const hasEquivalents = expression.equivalent_expressions && expression.equivalent_expressions.length > 0;

  return (
    <div className="expression-card">
      <div className="expression-header">
        <span
          className="lang-badge"
          style={{ backgroundColor: meta.color }}
        >
          {meta.name}
        </span>
        <span className="paradigm-badge">{expression.paradigm}</span>
      </div>

      <CodeBlock code={expression.code} language={language} />

      <div className="expression-explanation">
        {uiLanguage === 'zh' ? expression.explanation : (expression.explanation_en ?? expression.explanation)}
      </div>

      <div className="expression-layer-note">
        {expression.layer_note}
      </div>

      {expression.output && (
        <div className="expression-output">
          <span className="output-label">Output:</span>
          <code>{expression.output}</code>
        </div>
      )}

      {hasEquivalents && (
        <div className="equivalents-section">
          <button
            className="equivalents-toggle"
            onClick={() => toggleEquivalents(conceptId)}
          >
            {equivalentsOpen
              ? t('hide_equivalents', uiLanguage)
              : t('show_equivalents', uiLanguage)}
          </button>
          {equivalentsOpen && (
            <div className="equivalents-list">
              {expression.equivalent_expressions!.map((eq, i) => (
                <code key={i} className="equivalent-code">{eq}</code>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
