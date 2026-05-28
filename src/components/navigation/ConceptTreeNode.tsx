import type { ConceptStatus } from '@/types';
import { getConceptById } from '@/services/conceptEngine';

interface Props {
  conceptId: string;
  status: ConceptStatus;
  isActive: boolean;
  onSelect: () => void;
  uiLanguage: 'zh' | 'en';
}

const STATUS_ICONS: Record<ConceptStatus, string> = {
  unvisited: '○',
  exploring: '◐',
  practicing: '◑',
  mastered: '●',
};

const STATUS_COLORS: Record<ConceptStatus, string> = {
  unvisited: 'var(--text-muted)',
  exploring: 'var(--accent-yellow)',
  practicing: 'var(--accent-blue)',
  mastered: 'var(--accent-green)',
};

export function ConceptTreeNode({ conceptId, status, isActive, onSelect, uiLanguage }: Props) {
  const concept = getConceptById(conceptId);
  if (!concept) return null;

  const name = uiLanguage === 'zh' ? concept.name : concept.name_en;

  return (
    <div
      className={`concept-tree-node ${isActive ? 'active' : ''}`}
      onClick={onSelect}
    >
      <span
        className="node-status"
        style={{ color: STATUS_COLORS[status] }}
      >
        {STATUS_ICONS[status]}
      </span>
      <span className="node-name">{name}</span>
      <span className="node-difficulty">P{concept.difficulty}</span>
    </div>
  );
}
