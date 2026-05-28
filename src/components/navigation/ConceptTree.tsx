import { useConceptStore } from '@/store/conceptStore';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';
import { CATEGORIES } from '@/data/constants';
import { ConceptTreeNode } from './ConceptTreeNode';
import './ConceptTree.css';

export function ConceptTree() {
  const setActiveConcept = useConceptStore((s) => s.setActiveConcept);
  const activeConceptId = useConceptStore((s) => s.activeConceptId);
  const getConceptStatus = useProgressStore((s) => s.getConceptStatus);
  const uiLanguage = useUserStore((s) => s.profile.ui_language);

  return (
    <div className="concept-tree">
      {CATEGORIES.map((category) => (
        <div key={category.key} className="concept-category">
          <div className="category-label">
            {uiLanguage === 'zh' ? category.label : category.label_en}
          </div>
          {category.conceptIds.map((id) => (
            <ConceptTreeNode
              key={id}
              conceptId={id}
              status={getConceptStatus(id)}
              isActive={activeConceptId === id}
              onSelect={() => setActiveConcept(id)}
              uiLanguage={uiLanguage}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
