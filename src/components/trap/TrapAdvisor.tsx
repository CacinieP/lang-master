import { useMemo } from 'react';
import type { ConceptNode } from '@/types';
import { getRelevantTraps, getAllTraps, getPositiveTransfers } from '@/services/trapAdvisor';
import { useUserStore } from '@/store/userStore';
import { TrapCard } from './TrapCard';
import { TransferBadge } from './TransferBadge';
import { LANGUAGE_META } from '@/data/constants';
import './TrapAdvisor.css';

interface Props {
  concept: ConceptNode;
}

export function TrapAdvisor({ concept }: Props) {
  const knownLangs = useUserStore((s) => s.profile.known_languages);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);

  const knownLanguageCodes = useMemo(
    () => knownLangs.map((l) => l.language),
    [knownLangs],
  );

  const traps = knownLanguageCodes.length > 0
    ? getRelevantTraps(concept.id, knownLanguageCodes)
    : getAllTraps(concept.id);

  const transfers = knownLanguageCodes.length > 0
    ? getPositiveTransfers(concept.id, knownLanguageCodes)
    : [];

  if (traps.length === 0 && transfers.length === 0) {
    return (
      <div className="trap-advisor empty">
        <p className="trap-empty-text">
          {uiLanguage === 'zh' ? '暂无已知负迁移陷阱' : 'No known negative transfer traps'}
        </p>
      </div>
    );
  }

  return (
    <div className="trap-advisor">
      {traps.length > 0 && (
        <div className="trap-section">
          <h4 className="trap-section-title">
            ⚠ {uiLanguage === 'zh' ? '负迁移陷阱' : 'Negative Transfer Traps'}
            <span className="trap-count">{traps.length}</span>
          </h4>
          <div className="trap-list">
            {traps.map((t) => (
              <TrapCard
                key={t.key}
                sourceLang={LANGUAGE_META[t.source].name}
                targetLang={LANGUAGE_META[t.target].name}
                trap={t.trap}
              />
            ))}
          </div>
        </div>
      )}

      {transfers.length > 0 && (
        <div className="transfer-section">
          <h4 className="trap-section-title">
            ✓ {uiLanguage === 'zh' ? '正迁移加速' : 'Positive Transfers'}
          </h4>
          <div className="transfer-list">
            {transfers.map((t) => (
              <TransferBadge
                key={t.key}
                sourceLang={LANGUAGE_META[t.source].name}
                targetLang={LANGUAGE_META[t.target].name}
                transfer={t.transfer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
