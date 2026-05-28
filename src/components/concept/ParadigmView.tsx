import type { ConceptNode, AlphaLanguage, Paradigm, LanguageExpression } from '@/types';
import { useUIStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';
import { PARADIGM_LABELS } from '@/data/constants';
import { ExpressionCard } from './ExpressionCard';
import './ParadigmView.css';

interface Props {
  concept: ConceptNode;
}

// Group expressions by paradigm, then by language
function groupByParadigm(
  expressions: Partial<Record<AlphaLanguage, LanguageExpression>>,
  selectedLangs: AlphaLanguage[],
): Record<Paradigm, Array<{ lang: AlphaLanguage; expr: LanguageExpression }>> {
  const groups: Record<string, Array<{ lang: AlphaLanguage; expr: LanguageExpression }>> = {};

  for (const lang of selectedLangs) {
    const expr = expressions[lang];
    if (!expr) continue;
    const paradigm = expr.paradigm;
    if (!groups[paradigm]) groups[paradigm] = [];
    groups[paradigm].push({ lang, expr });
  }

  return groups as Record<Paradigm, Array<{ lang: AlphaLanguage; expr: LanguageExpression }>>;
}

const PARADIGM_ORDER: Paradigm[] = ['procedural', 'oop', 'functional'];

export function ParadigmView({ concept }: Props) {
  const selectedLanguages = useUIStore((s) => s.selectedLanguages);
  const languageDisplayOrder = useUIStore((s) => s.languageDisplayOrder);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);

  // Use display order for the selected languages (C7: random order)
  const orderedSelected = languageDisplayOrder.filter((l) =>
    selectedLanguages.includes(l),
  );

  const grouped = groupByParadigm(concept.expressions, orderedSelected);
  const usedParadigms = PARADIGM_ORDER.filter((p) => grouped[p]?.length);

  return (
    <div className="paradigm-view">
      <div className="paradigm-columns">
        {usedParadigms.map((paradigm) => (
          <div key={paradigm} className="paradigm-column">
            <div className="paradigm-column-header">
              <span className="paradigm-icon">{PARADIGM_LABELS[paradigm].icon}</span>
              <span className="paradigm-name">
                {uiLanguage === 'zh' ? PARADIGM_LABELS[paradigm].zh : PARADIGM_LABELS[paradigm].en}
              </span>
            </div>
            {grouped[paradigm]?.map(({ lang, expr }) => (
              <ExpressionCard
                key={lang}
                language={lang}
                expression={expr}
                conceptId={`${concept.id}-${lang}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
