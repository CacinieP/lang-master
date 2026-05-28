import { create } from 'zustand';
import type { ConceptNode, Layer, Paradigm } from '@/types';
import { initConceptEngine, getConceptById, getAllConcepts, getConceptsByLayer } from '@/services/conceptEngine';

interface ConceptState {
  concepts: ConceptNode[];
  activeConceptId: string | null;
  activeLayer: Layer | null;
  activeParadigm: Paradigm | null;

  init: (concepts: ConceptNode[]) => void;
  setActiveConcept: (id: string) => void;
  setActiveLayer: (layer: Layer | null) => void;
  setActiveParadigm: (paradigm: Paradigm | null) => void;
  getActiveConcept: () => ConceptNode | undefined;
  getFilteredConcepts: () => ConceptNode[];
}

export const useConceptStore = create<ConceptState>((set, get) => ({
  concepts: [],
  activeConceptId: null,
  activeLayer: null,
  activeParadigm: null,

  init: (concepts) => {
    // Also initialize the concept engine service
    initConceptEngine(concepts, { edges: [] }); // graph initialized separately
    set({ concepts });
  },

  setActiveConcept: (id) => set({ activeConceptId: id }),

  setActiveLayer: (layer) => set({ activeLayer: layer }),

  setActiveParadigm: (paradigm) => set({ activeParadigm: paradigm }),

  getActiveConcept: () => {
    const { activeConceptId } = get();
    if (!activeConceptId) return undefined;
    return getConceptById(activeConceptId);
  },

  getFilteredConcepts: () => {
    const { activeLayer, activeParadigm } = get();
    let filtered = getAllConcepts();
    if (activeLayer) {
      filtered = getConceptsByLayer(activeLayer);
    }
    if (activeParadigm) {
      filtered = filtered.filter((c) => c.paradigm_tags.includes(activeParadigm));
    }
    return filtered;
  },
}));
